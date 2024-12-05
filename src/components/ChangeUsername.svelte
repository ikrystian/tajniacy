<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let newUsername = '';

    function handleSubmit() {
        if (newUsername.trim()) {
            localStorage.setItem('username', newUsername);
            dispatch('change', newUsername);
        }
    }
</script>

<div class="popup">
    <h3>Zmień nazwę</h3>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={newUsername} placeholder="Podaj nową nazwę" required />
        <button type="submit">Zmień</button>
        <button type="button" on:click={() => dispatch('close')}>Zamknij</button>
    </form>
</div>

<style>
    .popup {
        /* Add your styles for the popup here */
        background: white;
        border: 1px solid #ccc;
        padding: 20px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }
</style>