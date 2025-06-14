import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const REPLICATE_TOKEN = process.env.VITE_REPLICATE_API_TOKEN

const TEXT_TO_IMAGE_VERSION =
  'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4' // stability-ai/stable-diffusion
const REMBG_VERSION =
  'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003' // cjwbw/rembg

app.post('/api/generate', async (req, res) => {
  const prompt = req.body.prompt

  try {
    // STEP 1: Text to image
    const submission = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: TEXT_TO_IMAGE_VERSION,
        input: { prompt },
      }),
    })

    const json = await submission.json()
    const predictionURL = json.urls.get

    let result = await (await fetch(predictionURL, {
      headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
    })).json()

    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000))
      result = await (await fetch(predictionURL, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
      })).json()
    }

    if (result.status !== 'succeeded')
      return res.status(500).json({ error: 'Image generation failed', detail: result })

    let output = result.output
    if (Array.isArray(output)) output = output[0]

    console.log('Initial image URL:', output)

    // STEP 2: Background removal
    const bgRemoval = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: REMBG_VERSION,
        input: { image: output },
      }),
    })

    const rembgJson = await bgRemoval.json()
    const rembgURL = rembgJson.urls.get

    let rembgResult = await (await fetch(rembgURL, {
      headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
    })).json()

    while (rembgResult.status !== 'succeeded' && rembgResult.status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000))
      rembgResult = await (await fetch(rembgURL, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
      })).json()
    }

    if (rembgResult.status !== 'succeeded')
      return res.status(500).json({ error: 'Background removal failed', detail: rembgResult })

    let finalImage = rembgResult.output
    if (Array.isArray(finalImage)) finalImage = finalImage[0]

    console.log('Final transparent image:', finalImage)
    return res.json({ image: finalImage })
  } catch (error) {
    console.error('Unhandled error:', error)
    res.status(500).json({ error: 'Internal server error', detail: error.message })
  }
})

app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001')
})
