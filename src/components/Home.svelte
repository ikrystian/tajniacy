<script>

    let username;
    import {navigate} from "svelte-routing";
    import {onMount} from "svelte";

    function newGame() {
        fetch('http://localhost:3000')
            .then(res => res.json())
            .then(data => {
                const id = data.id;
                alert(`Podeślij znajomemu to id ${id}`);

                navigate(`/game/${id}`, { replace: true });
            })
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
</div>