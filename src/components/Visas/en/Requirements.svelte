<script>

    let requirements = [
'The Passport',
'The Letter',
'The Entrance Stamp',
'The Bank Statements',
'The Health Insurance',
'The Criminal Records',
    ]


</script>

<div tabindex="0" class="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
    <input type="checkbox" /> 
    <div class="collapse-title text-xl font-medium">
      PREPARE THE DOCUMENTS
    </div>
    <div class="collapse-content"> 

{#each requirements as req, i }

<!-- The button to open modal -->
<label for="my-modal-{i+1}" class="btn">{req}</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-{i+1}" class="modal-toggle" />
<label for="my-modal-{i+1}" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">{req}!</h3>
    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
  </label>
</label>

{/each}
    </div>
</div>
