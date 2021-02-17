<!-- ━━━━━━━━━ JS | TS ━━━━━━━━━ -->
<script>
	import MeetUpItems from "./MeetUpItems.svelte";

	'use strict'// CHECKS TYPES

	/**: - ©MEMBER-PROPERTIES| */
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/
	export let meetUps
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/

	/**| ™- LABELED-STATEMENT |*/
	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/** #™━━━━━━━━━━━━━━━━━━━ FUNCTION ━━━━━━━━━━━━━━━━━━━ */
</script>
<!-- ⚫️⚫️⚫️⚫️⚫️⚫️⚫️⚫️⚫️🔵🔵🔵🔵🔵🔵🔵🔵━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<section class="foreach-meetup">
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
	<!--⌛-->

	<!--⫷⫷⫷|MeetUp ForEach|⫸⫸⫸-->
	{#each meetUps as meetup, i}
		<!--<h3><b># {i + 1}</b></h3>-->
		<MeetUpItems
			title={meetup.title}
			subtitle={meetup.subtitle}
			description={meetup.description}
			imgURL={meetup.imgURL}
			email={meetup.contactEmail}
			address="{meetup.address}"
		/>
	{/each}
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	<!--⌛-->
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
</section>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->

<!-- ━━━━━━━━━ CSS | SCSS | SASS ━━━━━━━━━ -->
<style>
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	* {
		--bg-cgradient: conic-gradient(
			from 90deg at bottom,
			white,
			rebeccapurple
		);
		/*⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫*/
		--txt-shadow: 1px 1px 1px #000,
		3px 3px 5px blue;
		/*⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫*/
		--contact-txt-shadow: 1px 1px 1px #000,
		3px 3px 5px black, 1px 1px 1px #000,
		3px 3px 5px blue;
		/*⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫*/
		--box-shadow: 1px 1px 1px lightslategray,
		3px 3px 5px gray;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	section {
		width: 100%;
		display: grid;
		align-items: center;
		grid-template-columns: 1fr;
		grid-gap: 1rem;
	}
	@media (min-width: 768px) {
		section {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	button {
		padding: .25em .7em;
		width: 35%;
		color: white;
		font-family: PermanentMarker-Regular, serif;
		font-style: oblique;
		font-size: 16px;
		opacity: 0.75;
		text-shadow: var(--contact-txt-shadow);
		caret-color: #262626;
		outline: none;
		cursor: pointer;
		background-image: var(--bg-cgradient);
		box-shadow: var(--box-shadow);
		border-radius: 5px;
	}
	button:active {
		color: rebeccapurple;
		opacity: 0.55;
		text-effect: outline;
		transition: all ease 0.25s;
		background: white;
		border: none;
		box-shadow: none;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	b {
		/*z-index: 1;*/
		color: mediumpurple;
		opacity: 0.85;
		font-family: Condiment, serif;
		font-size: 22px;
		text-shadow: var(--txt-shadow);
		caret-color: rebeccapurple;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
</style>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->
