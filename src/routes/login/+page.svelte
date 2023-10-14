<script lang='ts'>
  import Icon from '@iconify/svelte';
</script>

<form action='?/login' class='p-4' method='post'>
	<div class='card glass w-96 m-auto'>
		<div class='card-body'>
			<button class='btn'>
				<Icon class='text-lg' icon='flat-color-icons:google' />
				<span>Login Using Google</span>
			</button>
		</div>
	</div>
</form>