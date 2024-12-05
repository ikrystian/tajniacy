<script>
    import {Route, Router} from "svelte-routing";
    import Game from "./components/Game.svelte";
    import Home from "./components/Home.svelte";

    export let url = "";
</script>


<Router {url} >
    <div>
        <Route path="/game/:id" let:params>
            <Game id="{params.id}" />
        </Route>
        <Route path="/"><Home /></Route>
    </div>
</Router>