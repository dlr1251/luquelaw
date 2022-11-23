<script>

    let reqs = [
        `The authorities may ask you for your criminal records from 
        the country you are national from or where you reside.`
    ]
</script>

<h4>The Criminal Records requirements (optional)</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{pr}</span> 
            <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
