<script>
    let reqs = [
        'If you are applying from Colombia, provide a copy of your entrance permit (the stamp you got in your passport when you arrived).',
        'If you are applying from outside the country, provide a copy of your visa or permit from the country you are filing your application.'

    ]
</script>

<h4>The entrance stamp requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
        <span class="label-text">{pr}</span> 
        <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
