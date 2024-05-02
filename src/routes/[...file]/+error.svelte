<script>
    import { page } from '$app/stores';
</script>
<div class="row container-fluid">
    <div class="col">
        <div class="row w-100">
            <div class="col">
                <h1>{$page.status}</h1>
                <!-- file type is not handler or other error type-->
                <p>File type is not supported or other error occurred.</p>
            </div>
        </div>
        <div class="row w-100">
            <div class="col">
                <a href="/">Home</a>
            </div>
        </div>
    </div>
</div>