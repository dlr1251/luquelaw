<script>
    let reqs = [
        'Provide a photocopy of the frontpage of your passport, where your personal data is.',
        'Your passport must be valid for at least six (6) months beyond the date of your visa application.'
    ]
</script>

<h4>The passport requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
        <span class="label-text">{pr}</span> 
        <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
