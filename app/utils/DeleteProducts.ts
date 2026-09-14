export const handleDeleteProducts = async (productIDs: number[]) => {
    try {
        const deletePromises = productIDs.map((id) =>
            fetch(`https://dummyjson.com/products/${id}?delay=2000`, {
                method: "DELETE",
            }).then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to delete product with ID ${id}`);
                }
                return res.json();
            })
        );

        const results = await Promise.all(deletePromises);
        return results;
    } catch (error) {
        console.error("Error deleting products:", error);
        throw error;
    }
};