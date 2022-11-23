<script>

    let reqs = [
        `Demonstrate through recent bank statements that your monthly income has been 
        at least $3.000.000 COP (around $610USD) during the last 3 months`
    ]
</script>

<h4>The bank statements requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{pr}</span> 
            <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
