<!-- ━━━━━━━━━ JS | TS ━━━━━━━━━ -->
<script>
	'use strict'// CHECKS TYPES

	/**: - ©MEMBER-PROPERTIES| */
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/
	export let title
	export let subtitle
	export let imgURL
	export let description
	export let address
	export let email
	/*| #™━━━━━━━━━━━━━━━━━━━━━|*/

	/**| ™- LABELED-STATEMENT |*/
	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/* #™━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

	/** #™━━━━━━━━━━━━━━━━━━━ FUNCTION ━━━━━━━━━━━━━━━━━━━ */
</script>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->

<article class="container">
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
	<!--⌛-->

	<!--⫷⫷⫷|Header|⫸⫸⫸-->
	<header>
		<h1>
			<span class="header">{title}</span>
		</h1>
		<h2>
			<span class="header2">{subtitle}</span>
		</h2>
		<a class="contact-info">
			<span class="address">Address:</span>
			<span class="address2">{address}</span>
		</a>
	</header>
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	<!--⫷⫷⫷|Image|⫸⫸⫸-->
	<div class="image">
		<!--suppress HtmlUnknownTarget -->
		<img src="{imgURL}" alt="{title}">
	</div>
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	<!--⫷⫷⫷|Description|⫸⫸⫸-->
	<div class="content">
		<p>{description}</p>
	</div>
	<!--⫷⫷⫷|END|⫸⫸⫸-->

	<!--⫷⫷⫷|Footer * Buttons|⫸⫸⫸-->
	<footer>
		<a href="mailto:{email}" class="contact-info">
			Contact: <span class="email">{email}</span>
		</a>
		<div class="btn-wrapper">
		<button>
			<span class="">Show Details</span>
		</button>
		<button class="pad2">
			<span>Favorite</span>
		</button>
		</div>
	</footer>
	<!--⫷⫷⫷|END|⫸⫸⫸-->


	<!--⌛-->
	<!-- ━━━━━━━━━━━━━━━ CONTAINER ━━━━━━━━━━━━━━━ -->
</article>
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

	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	.contact-info {
		display: flex;
		justify-content: center;
		padding-top: 10px;
		margin-bottom: 10px;
		font-family: CoveredByYourGrace, serif;
		font-size: 25px;
		color: lightyellow;
		text-shadow: var(--contact-txt-shadow);
		caret-color: #262626;
		border: black;
		opacity: 0.75;
		text-decoration: none;
	}
	.email {
		margin-left: 10px;
		color: purple;
		font-family: Iceland, serif;
		text-shadow: var(--contact-txt-shadow);
		caret-color: #262626;
		border: black;
		text-decoration: underline;
	}
	.address {
		margin-right: 10px;
	}
	.address2 {
		font-size: 16px;
		padding-top: 10px;
		margin-right: 77px;
		color: purple;
		font-family: Iceland, serif;
		text-shadow: var(--contact-txt-shadow);
		caret-color: #262626;
		border: black;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	.btn-wrapper {
		text-align: center;
		margin-bottom: 10px;
	}
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
	.pad2 {
		margin-left: 30px;
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
	/*img {*/
	/*	border-radius: 6px;*/
	/*}*/
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	p {
		text-align: center;
		font-family: Iceland, serif;
		font-size: 22px;
		color: #908e9b
	}
	.header {
		font-family: Iceland, serif;
		font-size: 25px;
		color: white;
		font-weight: bold;
		text-shadow: var(--contact-txt-shadow);
		opacity: 0.65;
	}
	.header2 {
		font-family: Herculanum, serif;
		font-size: 18px;
		font-style: oblique;
		font-weight: bold;
		text-shadow: var(--contact-txt-shadow);
		opacity: 0.65;
	}

	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
	article {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
		border-radius: 5px;
		background: white;
		margin: 1rem;
	}
	header,
	.content,
	footer {
		padding: 1rem;
	}
	.image {
		width: 100%;
		height: 14rem;
	}
	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	h1 {
		font-size: 1.25rem;
		margin: 0.5rem 0;
	}
	h1.is-favorite {
		background: #01a129;
		color: white;
		padding: 0 0.5rem;
		border-radius: 5px;
	}
	h2 {
		font-size: 1rem;
		color: #808080;
		margin: 0.5rem 0;
	}
	p {
		font-size: 1.25rem;
		margin: 0;
	}
	div {
		text-align: right;
	}
	/* | ⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫⌫ | */
</style>
<!-- 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚫️⚫️⚫️⚫️⚫️ -->
