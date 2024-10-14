<template>
  console.log(isPressed.value)
  {{ isPressed }}
  <div>
    <div id="results">
      <span id="final_span" class="final">{{ finalText }}</span>
      <span id="interim_span" class="interim">{{ interimText }}</span>
    </div>
    <div id="visualization">
      <div id="viz1" class="visual" />
      <div id="viz2" class="visual" />
      <div id="viz3" class="visual" />
      <div id="viz4" class="visual" />
    </div>
    <BaseButton
      id="button"
      role="button"
      tabindex="0"
      rounded="full"
      :class="{ cancel: recognizing }"
      @mousedown="startRecognition"
      @mouseup="endRecognition"
      @touchstart="startRecognition"
      @touchend="endRecognition"
    >
      <Icon
        id="microphone"
        name="ph:microphone"
        class="size-5"
      />
      <div id="contents" />
    </BaseButton>
    <div id="tip" :class="{ show: showTip }">
      Press and hold to speak
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { isPressed, setIsPressed } = useUser()
const finalText = ref('')
const interimText = ref('')
const recognizing = ref(false)
const showTip = ref(false)
let recognition
let tipTimeout

const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition()
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
        else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      finalText.value = finalTranscript
      interimText.value = interimTranscript
    }

    recognition.onend = () => {
      recognizing.value = false
      if (finalText.value.trim() === '') {
        showTipMessage()
      }
    }
  }
}

const startRecognition = () => {
  if (!recognizing.value) {
    finalText.value = ''
    interimText.value = ''
    recognizing.value = true
    setIsPressed(true)
    console.log(isPressed.value)
    recognition.start()
  }
}

const endRecognition = () => {
  if (recognizing.value) {
    recognition.stop()
    recognizing.value = false
    setIsPressed(false)
    console.log(isPressed.value)
  }
}

const showTipMessage = () => {
  showTip.value = true
  clearTimeout(tipTimeout)
  tipTimeout = setTimeout(() => {
    showTip.value = false
  }, 3000)
}

onMounted(() => {
  initSpeechRecognition()
})

onBeforeUnmount(() => {
  if (recognition) recognition.abort()
})

</script>

  <style scoped>
  /* Add your styles here based on your previous CSS */

  #results {
    width: 100%;
    padding: 0 20px;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 50px;
    font-size: 24px;
    font-weight: 300;
    line-height: 1.5em;
  }

  #interim_span {
    opacity: 0.4;
  }

  #tip {
    position: absolute;
    bottom: 100px;
    left: 50%;
    width: 250px;
    opacity: 0.8;
    color: rgba(255, 255, 255, 0.75);
    margin-left: -125px;
    text-align: center;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s ease-in;
  }
  #tip.show {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-out;
  }

  .visual {
    position: absolute;
    bottom: 0;
    width: 400px;
    height: 400px;
    margin-bottom: -155px;
    border-radius: 100%;
    left: 50%;
    margin-left: -200px;
    z-index: 0;
    transform: scale(0.001);
    mix-blend-mode: screen;
    opacity: 0;
    transition: all 0.3s;
    background: rgba(255, 255, 255, 0.1);
  }

  #button:active {
    background-color: #dd0022;
  }
  #button:active #microphone {
    display: none;
  }

  #button.cancel #microphone {
    fill: transparent;
  }
  #button.cancel:before,
  #button.cancel:after {
    position: absolute;
    background-color: #fff;
    width: 2px;
    height: 16px;
    display: block;
    content: "";
    transform: rotate(45deg);
    left: 50%;
    top: 50%;
    margin-left: -1px;
    margin-top: -8px;
    opacity: 0.8;
    z-index: 15;
  }
  #button.cancel:after {
    transform: rotate(-45deg);
  }
  </style>
