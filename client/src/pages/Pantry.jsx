import { useState, useEffect } from "react";
import PantryItemForm from "../components/PantryItemForm";
import PantryItem from "../components/PantryItem";
import api from "../services/api";

function Pantry() {

    const [itemSaving, setItemSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [pantryList, setPantryList] = useState([]);
    const [pantryListLoading, setPantryListLoading] = useState(true);
    const [deletingItemId, setdeletingItemId] = useState(null);


    async function fetchPantryList() {

        setPantryListLoading(true);
        setError(null);

        try {

            const response = await api.get("/pantry");

            setPantryList(
                response.data.pantryList
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not load pantry list."
            );
            console.error(
                "Could not load pantry list:",
                error
            );
        } finally {
            setPantryListLoading(false);
        }
    }

    useEffect(() => {
        fetchPantryList();
    }, []);

    async function handleAddItem({ name }) {

        setItemSaving(true);
        setError(null);
        setMessage("");

        try {

            const response = await api.post(
                `/pantry`,
                {
                    name,
                }
            );

            await fetchPantryList();

            setMessage(response.data.message);

            return true;

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not save new pantry item."
            );

            console.error(
                "Could not save new pantry item.",
                error
            );

            return false;
        } finally {
            setItemSaving(false);
        }
    }


    async function handleDeleteItem(itemId) {

        setdeletingItemId(itemId);
        setError(null);
        setMessage("");

        try {

            const response = await api.delete(
                `/pantry/${itemId}`,
            );

            await fetchPantryList();

            setMessage(
                `${response.data.message} (${response.data.item.name})`
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Could not delete pantry item."
            );

            console.error(
                "Could not delete pantry item.",
                error
            );
        } finally {
            setdeletingItemId(null);
        }
    }

    return (
        <main className="page-container pantry-page">
            <h1 className="page-title">My Pantry List</h1>

            <div className="pantry-form-panel">
                <h3>Add new Pantry item:</h3>
                <PantryItemForm
                    onAddItem={handleAddItem}
                    isSaving={itemSaving}
                />
            </div>

            {message && (
                <p className="pantry-message"
                    role="status"
                    aria-live="polite"
                >
                    {message}
                </p>
            )}

            {error && (
                <p
                    className="pantry-error-message"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {pantryListLoading ? (
                <p>Loading Pantry List...</p>

            ) : pantryList.length === 0 ? (
                <p>No Pantry Items in your List</p>

            ) : (
                <div className="pantry-list"
                >
                    {pantryList.map((item) => {
                        return (
                            <PantryItem
                                key={item.id}
                                item={item}
                                onDelete={handleDeleteItem}
                                isDeleting={deletingItemId === item.id}
                            />
                        )
                    })
                    }
                </div>
            )}
        </main>
    )
}


export default Pantry; 