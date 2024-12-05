<script>

    import {navigate} from "svelte-routing";
    import {onMount} from "svelte";
    import ChangeUsername from './ChangeUsername.svelte';

    let username;
    let showPopup = false;

    function newGame() {
        fetch('http://localhost:3000')
            .then(res => res.json())
            .then(data => {
                const id = data.id;
                alert(`Podeślij znajomemu to id ${id}`);

                navigate(`/game/${id}`, { replace: true });
            })
    }

    function openPopup() {
        showPopup = true;
    }

    function closePopup() {
        showPopup = false;
    }

    function handleUsernameChange(newUsername) {
        username = newUsername.detail;
        closePopup();
    }

    onMount(() => {
        if(!localStorage.getItem('username')) {
            localStorage.setItem('username', 'user_' + new Date().getTime());
        }

        username = localStorage.getItem('username');
    })
</script>
<div>
    <h2>Witaj <strong>{username}</strong></h2>
    <button type="button" on:click={() => newGame()}>Stwórz grę</button>
    <button>Dołącz do gry</button>
    <button on:click={openPopup}>Zmień nazwę</button>
</div>

{#if showPopup}
<ChangeUsername on:change={handleUsernameChange} on:close={closePopup} />
{/if}