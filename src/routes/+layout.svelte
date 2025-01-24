<div class="container-flex">
    <nav class="navbar h2" style="background-color: #1849cf;">
        <a class="navbar-brand ms-2" href="#">
            <img src="/logo-light.svg" alt="Logo" height="36" class="d-inline-block my-auto me-2">
            <span class="h3 my-auto" style="color: rgb(247, 247, 247);">Signomix documentation</span>
        </a>
        <span class="text-end text-white h5 me-2" style="background-color: #1849cf;">
            <!-- <span on:click={showDialog}>Chat</span> -->
            <span on:click={() => modal.show()}><i class="bi bi-robot me-4 h2"></i></span>
            <a href="/pl/index.md" class="me-2">pl</a>
            <a href="/en/index.md" class="me-2">en</a>
        </span>
    </nav>

</div>
<ChatBotWindow bind:b5modal={modal}/>
<slot></slot>
<div class="container-fluid">
    <footer class="py-2 my-3 border-top">
        <div class="row ">
            <div class="col-3">
                <span class="text-body-secondary">&copy; 2023-2004 Grzegorz Skorupa</span>
            </div>
            <div class="col-9 text-end">
                <a class="text-body-secondary" href="https://github.com/gskorupa/cricket-website-template"
                    target="_blank"><i class="bi bi-github h4 text-black-50"></i></a>
            </div>
        </div>
    </footer>
</div>
<script>
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import ChatBotWindow from '$lib/ChatBotWindow.svelte';

    let modal
</script>
<style>
    dialog {
        position: absolute;
        top: 90%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }
</style>