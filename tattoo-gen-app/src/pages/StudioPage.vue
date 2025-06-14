<template>
  <v-container fluid>
    <v-row>
      <!-- Left Column -->
      <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-4">Generate Tattoo</h2>

        <v-text-field
        v-model="prompt"
        label="Prompt"
        placeholder="e.g. skull and roses"
        variant="outlined"
        class="mb-4"
        />

        <v-select
        v-model="bodyPart"
        :items="bodyParts"
        label="Placement"
        variant="outlined"
        class="mb-4"
        />

        <v-btn
        color="primary"
        class="mb-6"
        @click="generateTattoo"
        :loading="isLoading"
        :disabled="isLoading"
        >
        Generate Tattoo
        </v-btn>

        <!-- Canvas Box -->
        <v-sheet height="200" class="bg-grey-lighten-4 d-flex align-center justify-center">
        <div v-if="activeTattoo">
            <v-img :src="activeTattoo" max-height="180" contain />
            <v-btn color="success" class="mr-2 mt-2" @click="confirmTattoo">Confirm</v-btn>
            <v-btn color="error" class="mt-2" @click="rejectTattoo">Reject</v-btn>
        </div>
        <p v-else class="text-center">[ UV Canvas Preview Placeholder ]</p>
        </v-sheet>

        <!-- Layer Manager -->
        <v-card variant="tonal" elevation="0">
        <v-card-title>Tattoo Layers</v-card-title>
            <v-card-text>
                    <v-chip
                    v-for="(layer, index) in layers"
                    :key="layer.id"
                    class="ma-1"
                    label
                    closable
                    @click:close="removeLayer(layer.id)"
                    :color="layer.selected ? 'primary' : ''"
                    :variant="layer.selected ? 'flat' : 'tonal'"
                    @click="selectLayer(layer)"
                    >
                    {{ layer.label }}
                    <v-icon
                        size="16"
                        class="ml-1"
                        icon="mdi-arrow-up"
                        @click.stop="moveLayerUp(index)"
                    />
                    <v-icon
                        size="16"
                        icon="mdi-arrow-down"
                        @click.stop="moveLayerDown(index)"
                    />
                </v-chip>
                <p v-if="layers.length === 0" class="text-grey">No layers yet.</p>
            </v-card-text>
        </v-card>
    </v-col>

    <!-- Right Column -->
    <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-4">Live Preview</h2>
        <v-sheet
        class="bg-grey-lighten-3"
        height="400"
        rounded
        elevation="1"
        >
        <div
            class="preview-canvas"
            style="position: relative; width: 100%; height: 100%; overflow: hidden;"
        >
        <img
        v-for="(layer, index) in layers"
        :key="layer.id"
        :src="layer.src"
        :class="{ 'selected-layer': layer.selected }"
        :style="{
            position: 'absolute',
            top: `${layer.y}px`,
            left: `${layer.x}px`,
            transform: `rotate(${layer.rotation}deg) scale(${layer.scale})`,
            cursor: 'move',
            maxWidth: '120px',
            border: layer.selected ? '2px dashed #00f' : 'none',
            zIndex: index  // ← this line controls layer order!
        }"
        @mousedown="selectLayer(layer, $event)"
        @wheel.prevent="scaleOrRotate(layer, $event)"
        draggable="false"
        />
        </div>
        </v-sheet>
    </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { generateTattooImage } from '../api/generateTattoo'

const isLoading = ref(false)
const prompt = ref('')
const bodyPart = ref('Upper Arm')
const bodyParts = ['Upper Arm', 'Forearm', 'Upper Back', 'Thigh', 'Chest']
const tattooImageUrl = ref(null)


const generateTattoo = async () => {
  try {
    isLoading.value = true
    const url = await generateTattooImage(prompt.value)
    console.log("🎯 Full image URL result:", url)
    console.log("🧪 Type:", typeof url)
    console.log("🧾 Is string:", typeof url === 'string')
    activeTattoo.value = url
  } catch (err) {
    console.error(err)
    alert('Failed to generate tattoo')
  } finally {
    isLoading.value = false
  }
}

const activeTattoo = ref(null) // for the UV canvas preview
const tattooLayers = ref([])   // confirmed tattoos list
const layers = ref([])

const confirmTattoo = () => {
  if (activeTattoo.value) {
    const id = Date.now()
    const label = `Layer ${layers.value.length + 1}`

    layers.value.push({
      id,
      label,
      src: activeTattoo.value,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      selected: false,
    })

    activeTattoo.value = null
  }
}

const rejectTattoo = () => {
  activeTattoo.value = null
}


const addTattooLayer = (imageUrl) => {
  layers.value.push({
    id: Date.now(),
    src: imageUrl,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  })
}

let selectedLayer = null
let offsetX = 0
let offsetY = 0

const startDrag = (layer, event) => {
  selectedLayer = layer
  offsetX = event.offsetX
  offsetY = event.offsetY
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!selectedLayer) return
    const canvasRect = document.querySelector('.preview-canvas').getBoundingClientRect()
    selectedLayer.x = event.clientX - canvasRect.left - offsetX
    selectedLayer.y = event.clientY - canvasRect.top - offsetY
}

const stopDrag = () => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  selectedLayer = null
}

const selectLayer = (layer, event) => {
  layers.value.forEach(l => (l.selected = false))
  layer.selected = true
  selectedLayer = layer

  // Calculate proper offset relative to image position
  const rect = event.target.getBoundingClientRect()
  offsetX = event.clientX - rect.left
  offsetY = event.clientY - rect.top

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const scaleOrRotate = (layer, event) => {
  if (event.ctrlKey) {
    // CTRL + scroll = rotate
    layer.rotation += event.deltaY > 0 ? 5 : -5
  } else {
    // scroll = zoom
    layer.scale += event.deltaY < 0 ? 0.1 : -0.1
    if (layer.scale < 0.2) layer.scale = 0.2
  }
}

const removeLayer = (id) => {
  layers.value = layers.value.filter(layer => layer.id !== id)
}

const moveLayerUp = (index) => {
  if (index <= 0) return
  const temp = layers.value[index]
  layers.value.splice(index, 1)
  layers.value.splice(index - 1, 0, temp)
}

const moveLayerDown = (index) => {
  if (index >= layers.value.length - 1) return
  const temp = layers.value[index]
  layers.value.splice(index, 1)
  layers.value.splice(index + 1, 0, temp)
}

</script>
