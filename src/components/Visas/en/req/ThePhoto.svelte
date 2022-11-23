<script>
    let reqs = [
        'Recent color digital photograph with a white background',
        'The face must be facing the camera and with a neutral expression,',
        'The head complete and centered',
        'Both eyes must be open',
        'Neither hair nor accessories shall cover the head or face',
        'The size shall not exceed 300 kb',
        '3x4cm jpg format',
    ]
</script>

<h4>The photo requirements</h4>
{#each reqs as pr }
    <div class="form-control">
        <label class="label cursor-pointer">
        <span class="label-text">{pr}</span> 
        <input type="checkbox" class="checkbox checkbox-primary" />
        </label>
    </div>
{/each}
