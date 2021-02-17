<!-- ━━━━━━━━━ JS | TS ━━━━━━━━━ -->
<script>
	import HeaderComponent from "./Components/HeaderComponent.svelte";
	import MeetUpGrid from "./MeetUps/MeetUpGrid.svelte";

	'use strict'// CHECKS TYPES

	/**: - ©MEMBER-PROPERTIES| */
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/
	let title = ''
	let subtitle = ''
	let description = ''
	let imgURL = ''
	let address = ''
	let email = ''
	//___________
	let meetUps = [
		//___________
		{
			id: 'm1',
			title: 'Coding Bootcamp',
			subtitle: 'Learn to code in 2 hours',
			description: 'In this meetup we will have experts,' +
				' that will teach you how to code!',
			imgURL: 'https://images.pexels.com/photos/220887/' +
				'pexels-photo-220887.jpeg?auto=compress&cs' +
				'=tinysrgb&dpr=2&w=500',
			address: 'Apple st 127, L1 8JQ London England',
			contactEmail: 'codeHardCore@test.com',
		},
		{
			id: 'm2',
			title: 'Swim Together',
			subtitle: 'Let\'s go for swimming lessons',
			description: 'We will swim & enjoy the weather',
			imgURL: 'https://images.pexels.com/photos/462024/' +
				'pexels-photo-462024.jpeg?auto=compress&cs=' +
				'tinysrgb&dpr=2&w=500',
			address: 'Calle Del Mal, Republica Dominicana',
			contactEmail: 'codeHardCore@test.com',
		},

		//___________
	]
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/

	/**| ™- LABELED-STATEMENT |*/
	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/** #™━━━━━━━━━━━━━━━━━━━ FUNCTION ━━━━━━━━━━━━━━━━━━━ */
	const addMeetUp = () => {
		//___________
		/** Object literal */
		const newMeetUp = {
			id: (Math.random() * Date.now()).toString(),
			title: title,
			subtitle: subtitle,
			description: description,
			imgURL: imgURL,
			address: address,
			contactEmail: email
		}

		meetUps = [newMeetUp, ...meetUps]
	}
	/// --> : addMeetUp ♠♠♠
</script>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->

<div class="container">
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
	<!--⌛-->

	<!--⫷⫷⫷|HeaderComponent|⫸⫸⫸-->
	<HeaderComponent />
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	<!--⫷⫷⫷|@main|______________________________-->
	<main>

		<form on:submit|preventDefault={addMeetUp}>

			<!-- Title -->
			<div class="form-control">
				<label for="title">Title</label>
				<input
					bind:value={title}
					id="title"
					placeholder="Enter Title"
					type="text"
				>
			</div>

			<!-- Subtitle -->
			<div class="form-control">
				<label for="subtitle">Subtitle</label>
				<input
					bind:value={subtitle}
					id="subtitle"
					placeholder="Enter Subtitle"
					type="text"
				>
			</div>

			<!-- Address -->
			<div class="form-control">
				<label for="address">Address</label>
				<input
					bind:value={address}
					type="text"
					id="address"
					placeholder="Enter Address"
				>
			</div>

			<!-- Image-URL -->
			<div class="form-control">
				<label for="imgURL">Image URL</label>
				<input
					bind:value={imgURL}
					type="text"
					id="imgURL"
					placeholder="Enter Image URL"
				>
			</div>

			<!-- Email -->
			<div class="form-control">
				<label for="email">Email</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					placeholder="Enter Email"
				>
			</div>

			<!-- Description -->
			<div class="form-control">
				<label for="description">Description</label>
				<textarea
					id="description"
					placeholder="Enter Description"
					rows="3"></textarea>
			</div>

			<!-- Button(Save) -->
			<button type="submit">Save</button>

		</form>

	<!--⫷⫷⫷|MeetUpGrid|⫸⫸⫸-->
		<MeetUpGrid meetUps={meetUps} />
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	</main>
	<!--⫷⫷⫷|END|______________________________-->


	<!--⌛-->
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
</div>
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
	button {
		/*width: 35%;*/
		padding: .25em 4.5em;
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
	main {
		margin-top: 5rem;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	input {

	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
</style>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->
