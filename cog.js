class RotatingCog extends HTMLElement {
	connectedCallback() {
		const radius = parseInt(this.getAttribute('radius')) || 100
		const teethCount = parseInt(this.getAttribute('teeth')) || 5
		const color = getComputedStyle(this).getPropertyValue(
			'--rotating-cog-color',
		)
		const duration = parseInt(this.getAttribute('duration')) || 1
		const offset = parseFloat(this.getAttribute('offset')) || 0
		const counterclockwise = this.hasAttribute('counterclockwise')

		this.offScreenCanvas = new OffscreenCanvas(2 * radius, 2 * radius)
		this.context = this.offScreenCanvas.getContext('2d')

		const circuference = Math.PI * 2 * radius

		const teethRadius = Math.min(radius, 25)

		this.context.lineWidth = '1'
		this.context.fillStyle = color

		this.context.beginPath()
		this.context.arc(radius, radius, radius - teethRadius, 0, 2 * Math.PI)
		this.context.fill()

		const cogOffsetAngle = (2 * Math.PI) / teethCount
		const cogWidth = circuference / (2 * teethCount * 1.2) // 1.1 for smaller teeths to fit
		this.context.translate(radius, radius)
		for (let i = 0; i < teethCount; i++) {
			this.context.beginPath()
			this.context.rect(0, 0 - cogWidth / 2, radius, cogWidth)
			this.context.fill()
			this.context.rotate(cogOffsetAngle)
		}
		this.context.translate(-radius, -radius)

		const image = document.createElement('canvas')
		image.setAttribute('width', radius * 2)
		image.setAttribute('height', radius * 2)
		image.width = radius * 2
		image.height = radius * 2
		image
			.getContext('bitmaprenderer')
			.transferFromImageBitmap(this.offScreenCanvas.transferToImageBitmap())

		const style = document.createElement('style')
		style.innerHTML = `
			:host {
				display: block;
				position: relative;
				width: ${radius * 2}px;
				height: ${radius * 2}px;
				transform: rotate(${offset}turn);
			}
			@keyframes rotate {
				100% {
					transform: rotate(${counterclockwise ? -1 : 1}turn);
				}
			}
			canvas {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				animation: rotate ${duration}s linear infinite;
			}
		`

		const shadow = this.attachShadow({ mode: 'open' })
		shadow.innerHTML = ''
		shadow.appendChild(style)
		shadow.appendChild(image)
	}
}
