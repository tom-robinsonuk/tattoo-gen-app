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
    </v-col>

    <!-- Right Column -->
    <v-col cols="12" md="6">
        <h2 class="text-h5 font-weight-bold mb-4">Live Preview</h2>
          <v-alert type="info" variant="tonal" class="mb-4">
            <strong>🖱️ Tattoo Editor Controls</strong><br>
            • <b>Move:</b> Click and drag the tattoo image<br>
            • <b>Scale:</b> Scroll up/down to zoom<br>
            • <b>Rotate:</b> Hold <kbd>Ctrl</kbd> (or ⌘ on Mac) and scroll to rotate<br>
            • <b>Opacity:</b> Adjust slider or type value in layer panel<br>
            • <b>Reorder:</b> Use the up/down arrows next to layers<br>
            • <b>Duplicate:</b> Click copy icon or press <kbd>Ctrl</kbd> + <kbd>C</kbd><br>
            • <b>Undo:</b> <kbd>Ctrl</kbd> + <kbd>Z</kbd> &nbsp;&nbsp;&nbsp;&nbsp; • <b>Redo:</b> <kbd>Ctrl</kbd> + <kbd>Y</kbd><br>
            • <b>Select:</b> Click a tattoo to make adjustments
          </v-alert>
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
            opacity: layer.opacity,
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
        <!-- Layer Manager -->
        <v-card variant="tonal" elevation="0">
        <v-card-title>Tattoo Layers</v-card-title>
            <v-card-text>
              <v-list lines="one">
                <v-list-item
                  v-for="(layer, index) in layers"
                  :key="layer.id"
                  class="align-center"
                  :color="layer.selected ? 'primary' : ''"
                  @click="selectLayer(layer)"
                  style="border: 1px solid #ccc; margin-bottom: 8px; border-radius: 8px;"
                >
                  <template #prepend>
                    <v-avatar size="40">
                      <v-img :src="layer.src" />
                    </v-avatar>
                  </template>

                  <v-list-item-title>{{ layer.label }}</v-list-item-title>

                  <template #append>
                    <v-btn icon size="small" @click.stop="moveLayerUp(index)">
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn icon size="small" @click.stop="moveLayerDown(index)">
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                    <v-btn icon size="small" @click.stop="duplicateLayer(layer)">
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    <v-btn icon size="small" @click.stop="removeLayer(layer.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-slider
                      v-model="layer.opacity"
                      min="0"
                      max="1"
                      step="0.01"
                      class="ml-4"
                      style="width: 100px"
                      hide-details
                    />
                    <v-text-field
                      v-model.number="layer.opacity"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      class="ml-2"
                      style="width: 80px"
                      hide-details
                    />
                  </template>
                </v-list-item>
              </v-list>
                <p v-if="layers.length === 0" class="text-grey">No layers yet.</p>
            </v-card-text>
        </v-card>
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
    saveSnapshot() 
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
      opacity: 1,
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
  const scaledOffsetX = offsetX * selectedLayer.scale
  const scaledOffsetY = offsetY * selectedLayer.scale

  selectedLayer.x = event.clientX - canvasRect.left - scaledOffsetX
  selectedLayer.y = event.clientY - canvasRect.top - scaledOffsetY
}

const stopDrag = () => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  selectedLayer = null
}

const selectLayer = (layer, event = null) => {
  layers.value.forEach(l => (l.selected = false))
  layer.selected = true
  selectedLayer = layer

  // 🆕 Save state before interaction
  saveSnapshot()

  if (event) {
    const rect = event.target.getBoundingClientRect()
    offsetX = (event.clientX - rect.left) / layer.scale
    offsetY = (event.clientY - rect.top) / layer.scale

    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
  }
}

const scaleOrRotate = (layer, event) => {
  saveSnapshot() // 🆕 Save before modifying
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
  saveSnapshot() // 
  layers.value = layers.value.filter(layer => layer.id !== id)
}

const moveLayerUp = (index) => {
  if (index <= 0) return
  saveSnapshot()
  const temp = layers.value[index]
  layers.value.splice(index, 1)
  layers.value.splice(index - 1, 0, temp)
}

const moveLayerDown = (index) => {
  saveSnapshot() // 🆕 Save before modifying
  if (index >= layers.value.length - 1) return
  const temp = layers.value[index]
  layers.value.splice(index, 1)
  layers.value.splice(index + 1, 0, temp)
}

const duplicateLayer = (layer) => {
  console.log('Duplicating:', layer)
  saveSnapshot() // 
  const newLayer = {
    id: Date.now(),
    label: `Layer ${layers.value.length + 1}`,
    src: layer.src,
    x: layer.x + 20,
    y: layer.y + 20,
    scale: layer.scale,
    rotation: layer.rotation,
    selected: false,
  }
  layers.value = [...layers.value, newLayer] //layers.value.push(newLayer)
}


import { onMounted, onBeforeUnmount } from 'vue'

const handleKeydown = (e) => {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault()
    undo()
  } else if (e.ctrlKey && e.key === 'y') {
    e.preventDefault()
    redo()
  } else if (e.ctrlKey && e.key === 'c') {
    const selected = layers.value.find(l => l.selected)
    if (selected) duplicateLayer(selected)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const history = ref([])
const future = ref([]) // for redo

const saveSnapshot = () => {
  const snapshot = getCloneableLayers()
  history.value.push(JSON.parse(JSON.stringify(snapshot))) // safe deep clone
  future.value = []
}

const undo = () => {
  if (history.value.length === 0) return
  future.value.push(JSON.parse(JSON.stringify(getCloneableLayers())))
  layers.value = JSON.parse(JSON.stringify(history.value.pop()))
}

const redo = () => {
  if (future.value.length === 0) return
  history.value.push(JSON.parse(JSON.stringify(getCloneableLayers())))
  layers.value = JSON.parse(JSON.stringify(future.value.pop()))
}

const getCloneableLayers = () => {
  return layers.value.map(layer => ({
    id: layer.id,
    label: layer.label,
    src: layer.src,
    x: layer.x,
    y: layer.y,
    scale: layer.scale,
    rotation: layer.rotation,
    selected: layer.selected,
    opacity: layer.opacity,
  }))
}

</script>
