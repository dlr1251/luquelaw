<script>

    let reqs = [
        `Health policy with coverage in the national territory against all risks in case of accident, 
        illness, maternity, disability, hospitalization, death or repatriation, for the time foreseen 
        for their stay in the country.`
    ]
</script>

<h4>The Health insurance requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{pr}</span> 
            <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
