import sequelize from '../db'
import { MarketItem } from '../db/models'
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
  // Dimensions for the image
  const width = 300
  const height = 300
  const padding = 25
  const textHeight = 50
  const containerWidth = width - 2 * padding
  const containerHeight = containerWidth
  const imageContainerWidth = containerWidth
  const imageContainerHeight = containerHeight - textHeight
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
    console.log(imageContainerWidth, imageContainerHeight)
    console.log(realImageWidth, realImageHeight)
    if (imageWidth <= imageHeight) {
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

async function drawPage(index: number, items: MarketItem[]): Promise<void> {
  console.log(index)
  // Dimensions for the image
  const width = 900
  const height = 900

  // Instantiate the canvas object
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Fill the rectangle with purple
  context.fillStyle = '#fff'
  context.fillRect(0, 0, width, height)

  // draw frame
  await drawFrame9(
    context,
    items.map((item) => ({
      url: item.iconUrl,
      name: item.key,
    }))
  )

  // Write the image to file
  const buffer = canvas.toBuffer('image/png')
  const fileName = `${index}.png`
  fs.writeFileSync(`./public/market/en/${fileName}`, buffer)
}

async function task(): Promise<void> {
  await sequelize.sync()
  const items = await MarketItem.findAll()
  const pageCount = Math.ceil(items.length / 9)
  for (let i = 0; i < pageCount; i++) {
    const pageItems = items.slice(i * 9, i * 9 + 9)
    await drawPage(i, pageItems)
  }
  await sequelize.close()
}

task().catch((e) => console.log(e))
