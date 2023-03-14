import {
  createCanvas,
  Canvas,
  loadImage,
  CanvasRenderingContext2D,
} from 'canvas'
import fs from 'fs'

interface DrawFrameOption {
  url: string
  name: string
}

function getImageScaleFactor(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  mode: 'contain' | 'cover' = 'contain'
): number {
  if (mode === 'contain') {
    return Math.min(containerWidth / imageWidth, containerHeight / imageHeight)
  }
  return Math.max(containerWidth / imageWidth, containerHeight / imageHeight)
}

async function drawFrame(option?: DrawFrameOption): Promise<Canvas> {
  console.log('drawFrame 1')
  // Dimensions for the image
  const width = 300
  const height = 300
  const padding = 25
  const textHeight = 50
  const containerWidth = width - 2 * padding
  const containerHeight = containerWidth
  const imageContainerWidth = containerWidth
  const imageContainerHeight = containerHeight - textHeight
  console.log(containerHeight)
  console.log(imageContainerHeight)
  const textCenter = padding + imageContainerHeight + textHeight / 2

  // Instantiate the canvas object
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Fill the rectangle with purple
  context.fillStyle = '#ddd'
  context.fillRect(0, 0, width, height)

  context.fillStyle = '#fff'
  context.roundRect(
    padding,
    padding,
    width - padding * 2,
    height - padding * 2,
    25
  )
  context.fill()

  if (option) {
    // draw image
    console.log('load image')
    const image = await loadImage(option.url)

    const imageWidth = image.naturalWidth
    const imageHeight = image.naturalHeight
    const imageScale = getImageScaleFactor(
      imageWidth,
      imageHeight,
      imageContainerWidth,
      imageContainerHeight
    )
    const realImageWidth = imageWidth * imageScale
    const realImageHeight = imageHeight * imageScale
    if (imageWidth < imageHeight) {
      context.drawImage(
        image,
        padding + (imageContainerWidth - realImageWidth) / 2,
        padding,
        realImageWidth,
        realImageHeight
      )
    } else {
      context.drawImage(
        image,
        padding,
        padding + (imageContainerHeight - realImageHeight) / 2,
        realImageWidth,
        realImageHeight
      )
    }

    // draw text
    context.font = "bold 20pt 'PT Sans'"
    context.textAlign = 'center'
    context.fillStyle = '#333'
    context.textBaseline = 'middle'
    // 600 is the x value (the center of the image)
    // 170 is the y (the top of the line of text)
    context.fillText(option.name, width / 2, textCenter)
  }

  return canvas
}

async function drawFrame9(
  context: CanvasRenderingContext2D,
  options: DrawFrameOption[]
): Promise<void> {
  for (let i = 0; i < 9; i++) {
    const option = options[i]
    const f = await drawFrame(option)
    context.drawImage(f, 300 * (i % 3), 300 * Math.floor(i / 3))
  }
}

async function pr(): Promise<void> {
  console.log('start')
  // Dimensions for the image
  const width = 900
  const height = 900

  // Instantiate the canvas object
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  console.log('bg')
  // Fill the rectangle with purple
  context.fillStyle = '#fff'
  context.fillRect(0, 0, width, height)

  // draw frame
  await drawFrame9(context, [
    {
      // url: 'https://picsum.photos/200/300/?random',
      url: 'https://assets.zjzsxhy.com/upload/b200d320-a698-4b22-b645-a1019d2b9369.png',
      // url: 'https://assets.zjzsxhy.com/upload/42a0d69b-c90b-4c8a-974c-7367492ea8d7.svg',
      name: 'Test1',
    },
  ])

  // Write the image to file
  console.log('save')
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./public/test.png', buffer)
}

pr().catch((e) => console.log(e))
