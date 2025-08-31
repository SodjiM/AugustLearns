export const TOOL_SUPERSET = [
  {
    type: 'function',
    name: 'open_notepad',
    description: 'Reveal the notepad panel in the UI. Use when the user asks to open notepad or to write notes.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'open_profile',
    description: 'Open the profile dialog so the child can view or edit their profile.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'close_profile',
    description: 'Close the profile dialog.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'close_notepad',
    description: 'Hide the notepad panel in the UI.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'append_note',
    description: 'Append text to the current note page',
    parameters: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }
  },
  {
    type: 'function',
    name: 'draw_shape',
    description: 'Draw a simple shape on the canvas. Use normalized coordinates: x and y are 0..1 where (0.5,0.5) is center. For a circle use size for radius in px.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['circle','rect','label'] },
        x: { type: 'number' }, y: { type: 'number' },
        size: { type: 'number' }, radius: { type: 'number' },
        width: { type: 'number' }, height: { type: 'number' },
        color: { type: 'string' },
        text: { type: 'string' },
        fontSize: { type: 'number' }
      },
      required: ['kind','x','y','color']
    }
  },
  {
    type: 'function',
    name: 'clear_canvas',
    description: 'Clear the canvas',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'new_page',
    description: 'Create a new notepad page',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'goto_module',
    description: 'Navigate to a learning module by id. Example ids: "math.counting.toddler", "math.fractions.intro"',
    parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
  },
  {
    type: 'function',
    name: 'set_volume',
    description: 'Adjust app playback volume 0..1',
    parameters: { type: 'object', properties: { level: { type: 'number', minimum: 0, maximum: 1 } }, required: ['level'] }
  },
  {
    type: 'function',
    name: 'set_mic',
    description: 'Turn microphone on/off',
    parameters: { type: 'object', properties: { state: { type: 'string', enum: ['on','off'] } }, required: ['state'] }
  },
  {
    type: 'function',
    name: 'abcs_mark_letter',
    description: 'Light up an alphabet letter in the ABC module.',
    parameters: { type: 'object', properties: { letter: { type: 'string' } }, required: ['letter'] }
  },
  {
    type: 'function',
    name: 'abcs_mark_letters',
    description: 'Light up multiple alphabet letters parsed from a string (e.g., "abcdef").',
    parameters: { type: 'object', properties: { sequence: { type: 'string' } }, required: ['sequence'] }
  },
  {
    type: 'function',
    name: 'abcs_reset',
    description: 'Reset the ABC sing-along progress.',
    parameters: { type: 'object', properties: {} }
  },
  {
    type: 'function',
    name: 'abcs_celebrate',
    description: 'Trigger the celebration animation for completion.',
    parameters: { type: 'object', properties: {} }
  },
  {
    type: 'function',
    name: 'filter_modules',
    description: 'Filter and rank modules for the left panel. Returns chips and sections.',
    parameters: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        topics: { type: 'array', items: { type: 'string' } },
        skills: { type: 'array', items: { type: 'string' } },
        gradeBand: { type: 'string' },
        ageBand: { type: 'string' },
        modality: { type: 'array', items: { type: 'string' } },
        activityType: { type: 'array', items: { type: 'string' } },
        themeTags: { type: 'array', items: { type: 'string' } },
        maxDuration: { type: 'number' },
        sort: { type: 'string' }
      }
    }
  },
  {
    type: 'function',
    name: 'update_profile',
    description: 'Update the kid profile with a partial patch (favorites, grade, modalities, etc.)',
    parameters: { type: 'object', properties: { patch: { type: 'object' } }, required: ['patch'] }
  }
  ,
  {
    type: 'function',
    name: 'minimize_module_panel',
    description: 'Hide/minimize the left module panel so the main content is bigger.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'restore_module_panel',
    description: 'Restore/show the left module panel to normal size.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'toggle_module_panel',
    description: 'Toggle the module panel minimized state.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  // Barn Animals module tools
  {
    type: 'function',
    name: 'barn_next',
    description: 'Pick and show the next barn animal. Returns the selected animal details for evaluation (name and sound).',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'barn_reveal',
    description: 'Reveal the answer on the UI. Use to show the animal name and/or sound.',
    parameters: { type: 'object', properties: { name: { type: 'boolean' }, sound: { type: 'boolean' } } }
  },
  {
    type: 'function',
    name: 'barn_mark',
    description: 'Mark correctness for the child’s responses on the UI.',
    parameters: { type: 'object', properties: { nameCorrect: { type: 'boolean' }, soundCorrect: { type: 'boolean' } } }
  },
  {
    type: 'function',
    name: 'barn_reset',
    description: 'Reset the Barn Animals activity state.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'barn_celebrate',
    description: 'Trigger a small celebration animation.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  // Sea Adventure tools
  {
    type: 'function',
    name: 'sea_next_event',
    description: 'Create and show the next sea adventure event (count fish, color fish, or name creature). Returns event details for evaluation.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'sea_reveal',
    description: 'Reveal the correct answer for the current event (count/color/name).',
    parameters: { type: 'object', properties: { count: { type: 'boolean' }, color: { type: 'boolean' }, name: { type: 'boolean' } } }
  },
  {
    type: 'function',
    name: 'sea_mark',
    description: 'Mark correctness for the child’s response for the current event.',
    parameters: { type: 'object', properties: { countCorrect: { type: 'boolean' }, colorCorrect: { type: 'boolean' }, nameCorrect: { type: 'boolean' } } }
  },
  {
    type: 'function',
    name: 'sea_reset',
    description: 'Reset the sea adventure state (round counter and current event).',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    type: 'function',
    name: 'sea_celebrate',
    description: 'Trigger a small celebration animation for the sea adventure.',
    parameters: { type: 'object', properties: {}, additionalProperties: false }
  }
]


