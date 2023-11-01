<script lang='ts'>
	import FindTransport from './FindTransport.svelte';
	import Tracker from './Tracker.svelte';
	import type { TrackerComponent } from './types';

	let tracker: TrackerComponent;
</script>

<div class='card bordered bg-neutral bg-opacity-20'>
	<div class='card-body'>
		<div class='flex flex-col gap-2 flex-wrap'>
			<FindTransport />
			<Tracker bind:this={tracker} />
			<p class='text-center text-base-content/50'>
				Find and share bus and train locations in real-time.
			</p>
			<div class='text-center text-base-content/50'>(Currently in beta)</div>
		</div>
	</div>
</div>
