import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, PaymentStatus, OrderStatus } from '../../shared/entities/order.entity';
import { MailService } from '../../shared/services/mail.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../../shared/entities/product.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private mailService: MailService,
        private productsService: ProductsService,
        private dataSource: DataSource,
    ) { }

    async create(orderData: any) {
        return await this.dataSource.transaction(async transactionalEntityManager => {
            // 1. Verify and Decrease Stock
            for (const item of orderData.items) {
                // Determine if we have id (direct from products) or productId (from formatted cart)
                const pid = item.productId || item.id;
                
                const product = await transactionalEntityManager.findOne(Product, { 
                    where: { id: pid },
                    lock: { mode: 'pessimistic_write' } // Prevent race conditions
                });
                
                if (!product) {
                    throw new BadRequestException(`Product ${item.name || pid} not found.`);
                }

                // Ensure we are working with numbers
                const orderQty = parseInt(String(item.quantity || item.qty), 10) || 0;

                if (product.sizes && product.sizes.length > 0) {
                    const selectedSize = item.selectedSize || item.size;
                    if (!selectedSize) {
                        throw new BadRequestException(`Please select a size for ${product.name}.`);
                    }

                    const sizeIndex = product.sizes.findIndex(s => s.size === selectedSize);
                    if (sizeIndex === -1) {
                        throw new BadRequestException(`Size ${selectedSize} not available for ${product.name}.`);
                    }

                    const currentSizeStock = parseInt(String(product.sizes[sizeIndex].quantity), 10) || 0;
                    if (currentSizeStock < orderQty) {
                        throw new BadRequestException(`Insufficient stock for ${product.name} (Size: ${selectedSize}). Only ${currentSizeStock} left.`);
                    }

                    // Update specific size stock
                    product.sizes[sizeIndex].quantity = currentSizeStock - orderQty;
                    
                    // Update total stockQty
                    product.stockQty = product.sizes.reduce((sum, s) => sum + (parseInt(String(s.quantity)) || 0), 0);
                } else {
                    // Legacy/Single size product
                    const currentStock = parseInt(String(product.stockQty), 10) || 0;
                    if (currentStock < orderQty) {
                        throw new BadRequestException(`Insufficient stock for ${product.name}. Only ${currentStock} left.`);
                    }
                    product.stockQty = Math.max(0, currentStock - orderQty);
                }

                product.isActive = product.stockQty > 0;
                await transactionalEntityManager.save(product);
            }

            const order = this.orderRepository.create(orderData);
            const savedOrder: any = await transactionalEntityManager.save(order);

            // Move side effects (email) outside of the main critical path or handle after commit
            this.handlePostOrderActions(savedOrder);

            return {
                success: true,
                message: 'Order created successfully',
                data: savedOrder,
            };
        });
    }

    private async handlePostOrderActions(savedOrder: any) {
        try {
            // Send order confirmation to customer
            if (savedOrder.customer?.email) {
                const itemsList = Array.isArray(savedOrder.items) ? savedOrder.items : [];
                const itemsHtml = itemsList.map((item: any) => 
                    `<li>${item.name} (${item.quantity || item.qty}x) - ₹${item.price}</li>`
                ).join('');

                await this.mailService.sendEmail({
                    email: savedOrder.customer.email,
                    subject: `Order Received - #${savedOrder.id.slice(-8)}`,
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                          <h2 style="color: #333; text-align: center;">Order Received!</h2>
                          <p>Dear ${savedOrder.customer.name},</p>
                          <p>We have successfully received your order <strong>#${savedOrder.id.slice(-8)}</strong>.</p>
                          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                              <h3 style="margin-top: 0;">Order Summary</h3>
                              <ul>${itemsHtml}</ul>
                              <p><strong>Total Amount:</strong> ₹${parseFloat(savedOrder.totalAmount.toString()).toLocaleString()}</p>
                              <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
                          </div>
                          <p>Thank you for shopping with us!</p>
                      </div>
                    `,
                });
            }

            // Send new order alert to admin
            if (process.env.ADMIN_EMAIL) {
                await this.mailService.sendEmail({
                    email: process.env.ADMIN_EMAIL,
                    subject: `New Order Alert - #${savedOrder.id.slice(-8)}`,
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                          <h2 style="color: #333; text-align: center;">New Order Received!</h2>
                          <p>You have received a new order from <strong>${savedOrder.customer?.name}</strong>.</p>
                          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                              <p><strong>Order ID:</strong> ${savedOrder.id}</p>
                              <p><strong>Total Amount:</strong> ₹${parseFloat(savedOrder.totalAmount.toString()).toLocaleString()}</p>
                              <p><strong>Payment Method:</strong> ${savedOrder.paymentMethod}</p>
                          </div>
                      </div>
                    `,
                });
            }
        } catch (error) {
            console.error('Error in post-order actions:', error);
        }
    }

    async findOne(id: string) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return {
            success: true,
            data: order,
        };
    }

    async findByUser(email?: string, phone?: string) {
        if (!email && !phone) {
            return { success: false, message: 'Email or phone is required' };
        }

        const qb = this.orderRepository.createQueryBuilder('ord');

        if (email && phone) {
            qb.where("(LOWER(ord.customer->>'email') = LOWER(:email) OR ord.customer->>'phone' = :phone)", { email, phone });
        } else if (email) {
            qb.where("LOWER(ord.customer->>'email') = LOWER(:email)", { email });
        } else {
            qb.where("ord.customer->>'phone' = :phone", { phone });
        }

        qb.orderBy('ord.createdAt', 'DESC');
        const orders = await qb.getMany();

        return {
            success: true,
            data: orders,
        };
    }

    async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.paymentStatus = paymentStatus;
        await this.orderRepository.save(order);

        return {
            success: true,
            message: 'Payment status updated',
            data: order,
        };
    }

    async findAll(query: any) {
        const { status, paymentStatus } = query;
        const where: any = {};
        if (status) where.orderStatus = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        const orders = await this.orderRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            data: orders,
        };
    }

    async updateOrder(id: string, updateData: any) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const oldStatus = order.orderStatus;
        Object.assign(order, updateData);
        const savedOrder = await this.orderRepository.save(order);

        if (updateData.orderStatus === 'Confirmed' && oldStatus !== 'Confirmed' && order.customer?.email) {
            await this.mailService.sendEmail({
                email: order.customer.email,
                subject: `Order Confirmed - ${order.id.slice(-8)}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
              <h2 style="color: #333; text-align: center;">Order Confirmed!</h2>
              <p>Dear ${order.customer.name},</p>
              <p>We are happy to inform you that your order <strong>#${order.id.slice(-8)}</strong> has been confirmed by our team.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Order Summary</h3>
                  <p><strong>Total Amount:</strong> ₹${parseFloat(order.totalAmount.toString()).toLocaleString()}</p>
                  <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              </div>
              <p>We will notify you once your order is shipped.</p>
              <p>Thank you for shopping with us!</p>
          </div>
        `,
            });
        }

        return {
            success: true,
            message: 'Order updated successfully',
            data: savedOrder,
        };
    }
}
