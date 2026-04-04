export const generateWhatsAppMessage = (order) => {
    const whatsappGroup = 'https://chat.whatsapp.com/FWNFZSUDK52DjF8YOdu4L4?mode=gi_t';

    // Return the group link for now since we don't have a direct number.
    // If the user provides a number later, this can be updated to use wa.me for a direct message.
    return whatsappGroup;
};
