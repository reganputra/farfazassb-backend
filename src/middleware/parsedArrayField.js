export const parseArrayFields = (fields = []) => (req, res, next) => {
    fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
            try {
                req.body[field] = JSON.parse(req.body[field]);
            } catch (e) {
                console.error(`Failed to parse field ${field}:`, e);
                return res.status(400).json({ error: `Invalid JSON format for field ${field}` });
            }
        }
    });
    next();
};