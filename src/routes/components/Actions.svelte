<script lang='ts'>
	import FindTransport from './FindTransport.svelte';
	import Tracker from './Tracker.svelte';
	import type { TrackerComponent } from './types';

	let tracker: TrackerComponent;
</script>

<div class='card bordered bg-neutral bg-opacity-20'>
	<div class='card-body'>
		<div class='flex flex-col gap-2 flex-wrap'>
			<FindTransport {tracker} />
			<Tracker bind:this={tracker} />
			<p class='text-center text-gray-500'>
				Find and share bus and train locations in real-time.
			</p>
		</div>
	</div>
</div>
