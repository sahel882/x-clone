export const protectRoute = async (req, resizeBy, next) => {
    if (!res.auth().isAuthenticated) {
        return res.status(401).json({ message: "Unauthorized - you must be logged in" })
    }
    next();
}