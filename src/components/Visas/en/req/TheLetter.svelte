<script>
    let reqs = [
        'Letter in Spanish or English, issued by one or several foreign companies for which you provide your services, indicating the type of relationship and the type of remuneration received by the applicant. If you have a contract with said company, provide it, or demonstrate that you are a partner or co-owner of a company abroad and a letter indicating that your work for the company is carried out remotely;',
    ]
</script>

<h4>The letter requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
        <span class="label-text">{pr}</span> 
        <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
