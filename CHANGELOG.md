# Changelog

## 1.17.1

- scripting
    - add `updateCanvas()` function (forces a canvas widget to redraw)

- remote control
    - `/NOTIFY`: if multiple arguments are provided, interpret the first one as the icon's name for the client notification


## 1.17.0

- bug fixes
    - editor: error when ctrl+clicking on a root's child
    - range: multitouch interaction issue

- widget
    - knob / encoder: `sensitivity` and ctrl+drag gesture preserve `circular` mode behavior
    - knob / encoder: `snap` mode now works like `circular` mode except for the touch start event (value can't jump from start to end anymore)
    - patchbay: add `exclusive` option

- editor
    - allow interacting with a widget without selecting it by using the middle mouse button or by holding shift+win (shift+cmd on mac).

## 1.16.6

- bug fixes
    - visibility property update issues

## 1.16.4

- bug fixes
    - modal: display issue when a modal receives the same value mutliple times
    - patchbay: `outputs` property not handling object value properly
    - server: resolution conflict between app files and user files

- widgets
    - patchbay: trigger `onValue` script when a connection changes

- misc
    - windows: allow accessing other drives than the default one (list drives when the file browser reaches the filesystem's root)

## 1.16.3

- bug fixes
    - custom module: submodules not loading their own submodules with relative paths properly
    - custom module: issue with circular submodule requires
    - server: harmless error message when importing css files from the main theme file
    - server: allow using folder names "client" and "assets" for user files (eg for images used in a session)

- widgets
    - canvas: add `onResize` script property
    - scripting: expose javascript's `Image` constructor

## 1.16.2

- bug fixes
    - widget visibility not updated properly when set as a non-boolean value

- widgets
    - tabs: detach hidden tabs from the DOM (reduces lag caused by heavy tabs)

## 1.16.1

- bug fixes
     - eq widgets not properly converted when importing v0 sessions
     - image paths with url queries not loaded properly
     - @{} syntax not returning truncated value according to the widget's precision property (fixed for primitive values only, object values are still returned as is)

## 1.16.0

- advanced syntaxes
    - `@{}` and `VAR{}` that return objects / arrays do not return a copy of their value anymore as it may introduce a significant overhead when used extensively. Mutating these objects in `#{}` and `JS{}` scripts will now affect the actual values and should be avoided at all cost.
- widgets
    - `comments` property flagged as dynamic
    - multixy: add `doubleTap` property

## 1.15.8

- bug fixes
    - range: value update issue (internal touch state not updated properly)
    - scripting: send(): ignore `ignoreDefaults` property
    - script: onKeyboard script not cleaned upon edition / removal
    - editor: some variables not appearing as defined in `onKeyboard`

## 1.15.7

- bug fixes
    - matrix: property resolution issue with object/array items in `props`
    - bypass client option `nofocus=1` when the editor is enabled
    - menu/dropdown: display label when value is undefined

- misc
    - updated midi bridge: provide more information when loading fails; may fix some compatibility issue on windows

## 1.15.6

- bug fixes
    - ios: prevent server error related to the use of cookies
    - scripting: `getVar()` now returns a copy of the variable to prevent mutations on saved object

## 1.15.5

- bug fixes
    - matrix: avanced property issue in`props` property (bis)

- editor
    - inspector: add solo mode with `alt+click` for category panels

## 1.15.4

- bug fixes
    - matrix: avanced property issue in`props` property

## 1.15.3

- bug fixes
    - interaction issue ("deadzone") on touch screens
    - main menu not hidden when `read-only` is set
    - osc messages containing unicode characters not encoded correctly

## 1.15.2

- bug fixes
    - modal: scroll state not restored when the modal container is recreated
    - server: allow spaces and accentuated characters in client id

## 1.15.1

- bug fixes
    - prevent flickering on canvas based widgets when they are recreated

- editor
    - added code editor for `html` and `css` properties

- remote control
    - add `/RELOAD` command

## 1.15.0

- bug fixes
    - editor: prevent accessing non-editable widgets with right arrow
    - multixy: regression causing interaction issue

- widgets
    - add `lock` property to all widgets

- launcher
    - add `Autostart` menu option

- misc
    - update FontAwesome icon font to version 6

## 1.14.6

- bug fixes
    - inspector: script editor: cursor alignment issue in indented lines  
    - clone: prevent freeze and print an error when attempting to create a circular clone
    - modal: regression on android that prevents focusing input widgets in modals

## 1.14.5

- bug fixes
    - session loading error with some malformed property cases

## 1.14.4

- bug fixes
    - broken console interpreter since v1.14.0

- widgets
    - button: add `momentary` mode for sending messages with no value; prevent button from getting stuck when `on` and `off` are equal in `momentary` and `tap` modes

- inspector
    - color picker: inline picker widget (no longer in a modal); show color changes on the fly
    - code editor: validate input with `cmd+enter` instead of `ctrl+enter` on Mac

- scripting
    - `screen.height` and `screen.width` always returns the current screen dimensions
    - added `screen.orientation` global variable

- misc
    - some performance improvements

## 1.14.3

- bug fixes
    - osc receivers (`OSC{}` syntax) now apply the same rule as widgets regarding midi messages (only receive if the message's origin matches one of the host widget's midi targets)
    - modal: rendering issue on iOS
    - button: `locals.touchCoords` not updated since v1.14.0

- widgets
    - clone/fragment: remove scripting properties as they are supposed to bo overriden in `props`

## 1.14.2

- bug fixes
    - context-menu: double click issue in submenus on small touch screens
    - clone/fragment: broken onDraw / onTouch scripts if cloned widget is a canvas   

## 1.14.0, 1.14.1

- bug fixes
    - misc: sending typed arguments (`{type, value}` objects) should override the widget's `typeTags` definition
    - multixy: errors when `ephemeral` is `true`
    - scripting: `setVar` not affecting all widgets when mutliple widgets match provided id

- widgets
    - renamed `script` property to `onValue`, `draw` to `onDraw`, `touch` to `onTouch`
    - added `onCreate` script property to all widgets
    - added `onTouch` script to widgets that supported the touch state variable in scripts (now deprecated)
    - script: added `onKeyboard` property, removed `event` property
    - canvas: expose additional touch event informations (`radiusX`, `radiusY`, `rotationAngle` and iOS-only  `altitudeAngle`, `azimuthAngle` and `touchType`)

- scripting
    - special keyword `this` now returns the string `"this"`

- advanced syntaxes
    - added `IMPORT{file}` syntax to allow loading external files in properties

- editor
    - add fullscreen mode for properties with code editor enabled

## 1.13.2

- bug fixes
    - editor: keep relative sizes and positions when resizing multiple widgets at a time

- widgets
    - canvas: expose touch pressure (as `event.force`) in the `touch` script.
    - canvas: expose touch events for extra elements added with the `html` propery

## 1.13.1

- bug fixes
    - editor: data loss when leaving the editor's focus with no modifications  

## 1.13.0

- bug fixes
    - scripting: `storage.getItem()` not returning anything

- editor
    - new code editor for `script`, `touch`, `draw` and `props` properties with syntax hilighting, line numbers, etc

- scripting
    - `set()`: add an option to prevent target widget's script  

- widgets
    - root: add `hideMenu` property

- misc
    - minor cosmetic changes

## 1.12.0

- widgets
    - new **canvas** widget (under `pads`): allows creating custom widgets
    - button: expose normalized touch coordinates in scipts as `locals.touchCoords`
    - print a warning in the console when using advanced syntaxes in the script property

## 1.11.1

- bug fixes
    - client options specified in server config not working unless lowercased
    - make disconnection detection less aggressive (don't display notification if reconnection succeeds quickly)
    - panel: initial scroll state issue

## 1.11.0

- bug fixes
    - menu: interaction issue on iOS
    - script: prevent script functions from being called in the wrong scope (ie when leaked using the `globals` object) and print an explicit error
    - containers: prevent errors with some color formats in colorWidget
    - theme: relative url not resolved correctly

- widgets
    - when a panel contains widgets and has `scroll` set to `true`, its value will be used to represent the scroll position for x-axis and y-axis between 0 and 1.

## 1.10.3

- bug fixes
    - config not persistent on windows

- misc
    - read-only mode now hides and disables the main menu

## 1.10.2

- bug fixes
    - certificate expiration issue
    - regression breaking colors in canvas-based widgets

## 1.10.0

- bug fixes
    - sliders: ignore key order in `range`
    - sliders: handle mousewheel increment when starting from a value between two steps with `steps` property defined
    - inspector: allow scrolling in the help modal
    - console: fix command history behavior and increase history size

- widgets
    - encoder: expose angle in script (as `locals.angle`)
    - new textarea widget (multi line input)
    - expose the computed dimensions of canvas-based widgets in `css` (as `--widget-width` and `--widget-height`) and `script` (as `locals.width` and `locals.height`)

- client
    - add `Save backup` menu action (saves a backup copy of current session with an incremented suffix appended to the file name)

## 1.9.14

- bug fixes
    - modal: remove `html` property
    - matrix: nested property inheritance (eg. `@{id_@{id_x}}`) not working in `props`

## 1.9.13

- bug fixes
    - nested property inheritance (eg. `@{id_@{id_x}}`) not updating properly
    - canvas based widgets not updating when hidden

## 1.9.12

- bug fixes
    - client options: options ignored if not lowercased
    - sliders: prevent errors for some edge-case `range` values

## 1.9.11

- bug fixes
    - range: value not properly updated with set()

- misc
    - (built-in client only) add `nofocus` client option to prevent the client window from taking focus unless a text input or a dropdown is clicked.


## 1.9.10

- bug fixes
    - matrix: regression from 1.9.8 (broken nested @{} syntax in props property)

- misc
    - midi: detect missing binary (eg when deleted by antivirus) and print a message

## 1.9.9

- bug fixes
    - matrix: regression from 1.9.8

## 1.9.8

- bug fixes
    - matrix: update children when `props` is modified even when the result for `$ = 0` doesn't change
    - fragments: fragment widgets empty when reloading
    - panel: scrollbar issue on iOS 13+

- scripting
    - expose `console.clear()`

## 1.9.7

- bug fixes
    - issue when resizing widget using keyboard shortcuts
    - advanced syntaxes (VAR{}): avoid storing default value as string if it can be parsed as a javascript primitive (boolean, number, etc)
    - advanced syntaxes (VAR{}): ignore quotes around variable name

- editor
    - change keyboard shortcuts for moving widgets (now `mod + arrows`) and navigating in widgets (now `arrows`) to feel more natural with the project tree view.

- widgets
    - script: bypass keyboard shortcuts already used by the editor if it is enabled
    - matrix: removed ambiguous `start` property
    - matrix: advanced syntax blocks can be passed to children without being resolved at the matrix\' scope by adding an underscore before the opening bracket
    - text: add `soft` mode for the `wrap` property
    - input: improve `numeric` mode on iOS

## 1.9.6

- bug fixes
    - advanced syntaxes: `VAR{}` not updating when the default value is edited
    - editor: fix "Bring to front" and "Send to back" context menu actions

- ui
  - add keyboard shortcuts `mod + "+"` and `mod + "-"` to control zoom level

- widgets
    - input: add `numeric` property (allows numeric values only and displays numeric keyboard on mobile devices)
    - button: add `soft` mode for the `wrap` property
    - switch: add `wrap` property

- editor
    - display dropdown and checkbox for boolean properties with extra choices

## 1.9.5

- bug fixes
    - advanced syntaxes: various issues and regressions
    - editor: preserve advanced syntaxes in `left` and `top` when pasting a widget

- editor
    - tree: update widget visibility when it changes dynamically

## 1.9.4

- bug fixes
    - prevent error with empty `OSC{}` blocks
    - regression breaking advanced syntax blocks containing nested brackets

- advanced syntaxes
    - new syntax for creating and using custom variables in properties: `VAR{name, default}`
    - `JS{}` blocks don't require 2 brackets anymore (`JS{{}}` still works)

- scripting
    - add `getVar()` and `setVar()` for reading and modifying custom variables. This allows modifying properties directly from scripts (if they contain `VAR{}` blocks).
    - expose session path as `globals.session`

- editor
    - make tree item blink when hitting "Show in tree"

- remote control
    - add `/SCRIPT` command to run scripts remotely

## 1.9.3

- bug fixes
    - scripting: set() not working from a slider to a pad
    - tabs not sending messages / triggering scripts when clicked in editing mode
    - prevent hang with some syntax errors in advanced syntaxes
    - don't show project tree if minimized when creating a new widget (1.9.2 regression)
    - fix "ID + 1" paste for widgets with numeric ids
    - dropdown: reset the underlying dropdown when the widget's value is undefined

- editor
    - tree: allow specifying multiple type filters
    - tree: add "Show in session" context menu action

## 1.9.2

- bug fixes
    - visualizer: remove `bars` and `dots` option
    - plot: fix `bars` option
    - project tree: clear filter input when loading a session
    - server: fix serving files from paths containing accents
    - editor: keep editor open when loading a session
    - menu: prevent clipping in container on iOS

- widgets
    - image: add pre defined values for `size`, `position` and `repeat` properties
    - text: add vertical alignment choices to `align`

- editor
    - tree: add icons before widget ids depending on the category
    - tree: activate tab when selecting it in the project tree
    - tree: allow dragging widgets from a container to another
    - tree: expand container when a new widget is created inside it
    - tree: add support for filtering widgets by type (by typing `type:fader` for example)
    - smarter shift+drag selection: allow selecting widgets in the area when the event started on the parent container
    - select newly created widgets/tab except when copy-pasting

- remote control
    - add `/STATE/SEND` command

## 1.9.1

- bug fixes
    - button: allow writing strings like `"1.0"` in `label` without removing the decimals
    - editor: use css variable `--grid-width` at startup and after disabling & enabling the grid
    - launcher: regression preventing server halt when built-in client is closed manually beforehand
    - scripting: prevent crash (built-in client only) when using the variable `navigator`

- widgets
    - menu/switch/dropdown: reset value to `undefined` when receiving a value that's not defined in `values`

- scripting
    - expose instance of navigator [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) as `globals.clipboard`

- midi
    - allow sending note off with velocity
    - add option for receiving note off with velocity

- misc
    - v0->v1 session conversion: remove `JS{{}}` in script property

## 1.9.0

**Warning** Sessions saved with this version will not open in older versions (sessions saved with older version will open in this version).  

- bug fixes
    - remote-root option not applied on resources loaded by the client app (css images, etc)
    - input: display issue when resizing the window
    - launcher: cancel stopping the server when there are unsaved changes in the built-in client

- editor
    - context menu: add `export` action to export a widget as a fragment file
    - show project tree if minimized when clicking on "Show in tree"

- widget
    - **new** `fragment` widgets (under `containers`): embedded session or fragment file with overridable properties.
    - add `comments` property to all widgets

- launcher
    - add `Always on top` menu toggle

## 1.8.15

- bug fixes
    - editor: error when duplicating widget while if the clipboard is empty
    - ui: local zoom move issue when not in fullscreen
    - custom module: `clearInterval()` not working
    - regression breaking style attribute in html property

- misc
    - faster local zoom  

## 1.8.14

- bug fixes
    - `alt+shift+c` not working when pressed before dragging
    - incremental pasting issue with address property
    - generate scrollbars for panels on iOS 13+
    - fix scrolling on chrome for iOS 13+

- editor
    - add `mod+d` and `mod+shift+d` for duplicating widgets
    - use a temporary clipboard when duplicating widgets

- misc
    - inspector: move `script` property to `scripting` category
    - ui: minor style tweaks


## 1.8.13

- widgets
    - file: show save icon when mode is set to save
    - file: center icon when hidePath is set to true
    - sliders/pads: apply `spring` property dynamically

- ui
    - add `alt`+`wheel` for local zoom centered on cursor

- editor
    - add `alt+c+drag` and `alt+shift+c+drag` for duplicating dragged widgets

## 1.8.12

- bug fixes:
    - project tree: filter input position issue when scrolling
    - sliders/pads: apply `spring` property dynamically

- project tree
    - select range of contiguous widgets with shift + click

- misc
    - plot: remove unused `filters` property; fix description for `rangeX` and `rangeY`
    - console: focus input when the console opens

## 1.8.11

- bug fixes
    - switch: widget not reacting at first touch when traversing is enabled on parent
    - sliders: disable mousewheel when `spring` is enabled

- widgets
    - script: add `once` event mode
    - encoder: remove `spring` property

- custom module
    - expose `process` global

- scripting
    - add `openUrl` function

## 1.8.10

- bug fixes
    - modal: issues with children's visibility
    - console: allow multiple arguments in console.log()

- ui
    - launcher: add many keyboard shortcuts
    - client: add keyboard shortcuts for clearing the console

- scripting
    - add `setFocus` function to focus an input widget programmatically

- misc
    - add `usePercents` client option

## 1.8.9

- bug fixes
    - script: issue when using the `options` argument in `set()` (options leaked to subsequent set() calls in the script)
     - multixy: `decimals` property not applied
     - multixy: spring behavior not working until all points are released  
     - custom module: prevent require() from reading submodules files each time and instead return the object in memory

## 1.8.8

- launcher
    - add file browser button for the `theme` option and fix parsing path containing spaces if only one theme is set

- windows
    - remove `ctrl+w` shortcut for closing a window (use `alt+f4` instead)


## 1.8.7

- midi
    - add active sensing messages support (received as sysex)

- remote control
    - restore `/TABS` command (for opening tabs by ids)

- widgets
    - encoder: expose rotation speed in script (as `locals.speed`)

## 1.8.6

- bug fixes
    - range: per-fader touch event not emitted properly
    - rgb: fix `spring` property
    - rgb: touch event not emitted

## 1.8.5

- bug fixes
    - midi: debug messages displayed as errors
    - launcher: broken context menu

## 1.8.4

- bug fixes
    - input: prevent focus when selecting the widget for edition
    - input: submit content when leaving focus, not only when hitting `enter` or `tab` (`esc` still cancels)
    - midi: prevent midi bridge from stopping when an error occurs; provide meaningful errors when connection fails

- editor
    - inspector: hitting ctrl+s while editing a property will submit the change before saving

- ui
    - hide the console toggle button when the bottom panel is minimized and the editor is disabled

- widgets
    - file: add `mode` property, for choosing between `open` and `save` modes
    - switch: add `flip` mode

## 1.8.3

- bug fixes
    - keyboard: allow note numbers up to 127
    - server: return http 404 error when a user-requested resource is not found instead of keeping a pending request
    - modal: `visible` property not applied correctly


- project tree
    - add an input for filtering displayed widget by id

## 1.8.2

- bug fixes
    - menu: allow manual line breaks ("`\n`") in labels / values
    - custom module: parsing issue when sending widget data using `receive()` (`type` attribute erroneously parsed as an osc typetag)

- widgets
    - html property: allow "href" attribute on "a" elements


## 1.8.1

- bug fixes
    - script: stops triggering osc messages under some circumstances

## 1.8.0

- bug fixes
    - project tree: layout issue with deeply nested widgets
    - ios 10.3 regression
    - file browser: layout issue with long paths

- custom module
    - add `nativeRequire` function (allows loading native node modules or locally installed modules)

## 1.7.8

- bug fixes
    - canvas-based widgets not drawn when placed in a modal while having a conditional visibility set
    - text: missing `decimals` property
    - clone: fix usage of osc listener syntax (acts as if clone has an `address` property set to `auto`)

- widgets
    - clone: make `props` property dynamic (avoid full widget rebuild when possible)

- misc
    - increase client console history size and allow changing it with client url options

## 1.7.7

- bug fixes
    - startup regression

## 1.7.6

- bug fixes
    - (harmless) error raised when starting the server from the launcher with `debug` set to `true`

- editor
    - display/save color picked values with css rgba notation instead of hexadecimal

- widgets
    - modal: add `ignoreTabs` option (allows overflowing tab ancestors)
    - menu: add `ignoreTabs` option

## 1.7.5

- bug fixes
    - ios: cloned menu not displayed correctly
    - engine: downgrade to fix startup issue on windows

## 1.7.4

- bug fixes
    - editor: cloned `dropdown` and `input` widgets not opening when selected
    - widgets: prevent value-stateless widgets (tap buttons, clone, scripts, html and svg) from sending a value for cross-client synchronization (leads to unexpected script execution) and exclude them from state saves
    - input: apply `decimals` number before checking the value against the `validation` expression
    - range: `steps` and `dashed` property not working; remove `origin` property
    - config conflicts between launcher and server (affecting at least session history)

## 1.7.3

- bug fixes
    - custom module / theme: prevent reloading the module while the file is being written to
    - server: if a theme is used, attempt to resolve image urls against the theme file's location
    - modal/button: prevent error when `label` is updated

- widgets
    - encoder: add  `ticks` property back

## 1.7.2

- bug fixes
    - midi: mtc parsing error
    - custom module: hot reload cache issue on windows


## 1.7.1

- bug fixes
    - regression causing server errors

## 1.7.0

**Important change**

Prebuilt binaries are now supplied only for 64bit Linux/MacOs/Windows. Other platforms should use the `node` package or build it from sources.

**MIDI support**

As of this version, packages except the `node` package are bundled with a midi binary that will be used whenever midi's `path` option is not set. It is no longer necessary to install `python` and `python-rtmidi`.

**Changelog**


- bug fixes
    - editor: missing context menu (copy, paste) in inspector inputs
    - widgets: osc listeners not resolving "auto" address
    - cli: `ELECTRON_RUN_AS_NODE` headless mode not working without `--no-gui` option
    - ios: clone widget not laid out properly in horizontal panels
    - ui: missing vertical scrollbar when root's height overflows the workspace
    - server: provide readable error when a file requested by the client file is not found  
    - tab: content not drawn when changing visible property
    - matrix: addresses not generated property when matrix' address is `auto`

- ui
    - add console bottom panel with a simple script interpreter

- widgets
    - keyboard: add `velocity` property (allows mapping the touch coordinates between `off` (top) and `on` (bottom))
    - input: add `validation` property (allows defining a regular expression that the value must match)
    - modal: add `relative` position property

- midi
    - accept sending sysex strings without spaces between the bytes
    - load prebuilt midi binary on 64bit linux/windows/osx
    - add support for midi time code messages

- misc
    - sessions converted from v0 will use the widget's html property to display the former label property

## 1.6.2

- bug fixes
    - matrix: issues when changing non-dynamic properties (content not properly removed)
    - input: apply default value when receiving an empty value or no value at all

## 1.6.1

- bug fixes
    - keyboard: prevent `script` property from being copied to each key

- widgets
    - keyboard: make `on` and `off` properties dynamic
    - script: add `getIndex` function
    - matrix/keyboard: `id` variable in script is now the `id` of the child widget that triggered the event

## 1.6.0

- bug fixes
    - range: error when setting `default` property
    - range: fix `doubleTap` property

- widgets
    - all: add `html` property to allow inserting custom content in widgets (label, value, etc) and style it with the `css` property.

- scripting:
    - `send()`: ignore the widget's `bypass` property (allows bypassing default messages and define custom ones)
    - `set()`: add supports for wildcards in the id parameter
    - `set()`: add a 3rd optional parameter for preventing further script executions and/or osc messages from being sent

- custom module
    - automatically reload custom module when the file is modified
    - add support for loading submodules with `require()`

- theme
    - automatically reload theme when the file is modified

## 1.5.4

- bug fixes
    - ssl: generate unique certificates (with random serial numbers) to avoid reuse errors. Certificates generated with older versions of o-s-c will be updated automatically.
    - `~/` path prefix not recognized when using remote control commands like `/SESSION/SAVE`
    - `~/` path prefix not recognized in `remote-root` option
    - editor: paste ID+1: midi-related addresses should not be incremented

- remote control
    - add `/STATE/OPEN` and `/STATE/SAVE` commands
    - ignore unsaved changes when loading a session with `/SESSION/OPEN`
    - resolve relative file paths against `remote-root` setting  

## 1.5.3

- bug fixes
    - editor: error when `preArgs` and `address` are modified at the same time (affects `/EDIT` command and matrix/clone widgets)

## 1.5.2

- bug fixes
    - launcher: midi device names containing multiple spaces not parsed correctly
    - fullscreen: lack of support not detected on some ios devices
    - multixy: labels not hidden when `ephemeral` is `true`

- remote control
    - add `/SESSION/OPEN` and `/SESSION/SAVE` commands

## 1.5.1

- bug fixes
    - widgets: touch state scripts not triggering some synchronization mechanism

- widgets
    - encoder: remove `steps`, `ticks` and `origin` properties
    - encoder: make `sensitivity` work with values below 1

## 1.5.0

- bug fixes
    - image: broken value validation
    - menu/dropdown: use correct z-index
    - dropdown: prevent dropdown from opening when selecting the widget for edition

- editor
    - holding `alt` extends the north-west handle to the widget's size to ease dragging
    - widget properties reordered (e.g. style-related properties, even widget-specific, are now under the "style" category)

- widgets
    - remove `colorBg` for all widgets except containers
    - widgets background color is now transparent by default (can be overridden with css)
    - keyboard: added `colorBlack` and `colorWhite` properties to customize key colors
    - dropdown/menu: add `label` property (with support easy key/value display)
    - dropdown/menu: add `icon` toggle property
    - modal: add `popupPadding` property to control the button's and the container's padding independently

## 1.4.1

- bug fixes
    - multixy/range: prevent some extra touch state events;`

## 1.4.0

- bug fixes
    - project tree: error when dropping a widget at its initial position

- editor
    - validate property change when clicking on a widget
    - cancel property change when hitting escape
    - add menu and keyboard shortcuts to reorder widgets
    - add keyboard shortcut to show widget in project tree
    - selected widget is not showed on top of the others anymore

- widgets
    - expose widgets unique identifiers with property name "uuid"
    - xy/multixy: add `ephemeral` property
    - fader/knob/xy/range/multixy: remove `touchAddress` property
    - fader/knob/xy/range/multixy: expose touch state in `script` property (`touchAddress` usages will be converted automatically)

## 1.3.0

- bug fixes
    - editor: hide impossible actions from context-menu (eg adding widgets in tab containers)  
    - editor: error when selecting a tab/root widget while a property field contains unsubmitted changes
    - panel: layout issue with tabs & lineWidth property
    - input: extend focusable area

- midi
    - remove variable args in sysex messages (dynamic properties and scripting can be used to this effect)
    - add support for sending sysex bytes as integers
    - allow sending any system message (eg MIDI time code)
    - add support for receiving MIDI time code messages (as raw sysex) (requires adding the `mtc` flag to the midi configuration)


## 1.2.1

- scripting
    - expose toolbar menu actions

- remote control
    - optimise small changes made with /EDIT

- widgets
    - button: add `wrap` and `vertical` properties
    - root: add `width` and `height` properties (helps building mobile layouts)

## 1.2.0

- bug fixes
    - editor: id not incremented when pasting multiple widgets with id+1

- main
    - remove support for extra args in the `custom-module` option (fixes some path issues)

- widgets
    - all: add `lineWidth` style property
    - knob: add `solid` & `line` designs
    - fader: add `knobSize` property

- editor
    - preserve percentages in position/size
    - add 'Relative units (%)' option to use percents automatically on new widgets

## 1.1.0

- bug fixes
    - iOS 14+ scrolling issue

- midi
    - add support for channel pressure and key pressure messages

- widgets
    - svg: remove support for non-standard `%x` and `%y` units; fixed layout update when resized;
    - knob: add support for custom dash/gap size in `dashed` property

## 1.0.4

- bug fixes
    - script: broken `storage.getItem` and `storage.removeItem`
    - regression breaking `remote-root` option when starting with the launcher


## 1.0.3

- bug fixes
    - modal: layout issue on iOS

- widgets
    - panels: added `contain` property to allow scrolling in vertical/horizontal layouts

- midi
    - add support for named ports in midi configuration


## 1.0.2

- bug fixes
    - broken scrolling on iPhone iOS 13
    - window geometry issue  

## 1.0.1

- UI
    - windows' dimensions and position are now saved upon closing and restored at startup

## 1.0.0

*This list is not exhaustive*

- compatibility
    - dropped support for iOS 9
    - firefox (75+) support

- UI
    - overhaul design reworked
    - foldable sidepanels
    - removed lobby
    - added toolbar menu
    - display loading (spinner) in a notification instead of a modal
    - mod + w to close window
    - context-menu now use click event to trigger actions, not mousedown/touchstart
    - no more uppercase text by default

- themes
    - built-in themes removed except `orange`

- translations
    - incomplete russian translation removed

- editor
    - project tree
    - dropdown for properties with multiple choices
    - color picker
    - preview numeric values for style-related properties set to auto
    - context menu: added "show in tree" action
    - context menu: removed "edit parent" action
    - allow copying tabs (to tab containers only)
    - shared clipboard across all clients
    - prevent interaction with widgets when `shift` or `ctrl` is held
    - ensure @{} bindings are always updated upon edition


- widget changes
    - all: removed `label` option except for buttons, tabs and modals (one should use `text` widgets if needed)
    - all: removed support for `null` and `"self"` targets
    - all: added `ignoreDefaults` property (allows ignoring the server's default targets)
    - all: `precision` property to `decimals`, don't set osc integer typetag when 0
    - all: added `typeTags` property
    - all: multiple style properties to control visibility, colors, alphas and padding
    - all: added `interaction` (=> css `pointer-events: none;`)
    - all: added `expand` (=> css `flex: 1;`)
    - all:  prevent html tags in label
    - pads: removed `split` property -> use custom-module or script instead
    - root: can contain widgets or tabs
    - panels: added `layout`, `justify` and `gridTemplate` to help managing layouts (especially responsive ones)
    - panels: added `verticalTabs` property
    - panels: added `traversing` property, allow restricting `traversing` to a specific widget type
    - fader: removed `input`
    - fader: removed `meter`
    - fader: added `gradient`
    - fader: added `round` design style
    - fader: support setting dash size and gap size in `dashed` property
    - switch: added `layout` (including grid)
    - switch: added `click` mode
    - plot/eq: removed `smooth`
    - plots/sliders/pads: reversed `logScale` behavior to match standard implementations; can be either `false` (disabled), `true` (logarithmic scale) or `number` (manual log scale, negative for exponential scale)
    - visualizer: added `framerate` property
    - visualizer: added `freeze` property
    - menu: always centered menu
    - modal: modals can't overflow parent tab boundaries
    - input: removed `vertical`
    - pads, range: when `touchAddress` is set, one message per touched point is sent, in addition to the former touch state message
    - eq: removed `logScaleX` property, always draw logarithmic frequency response
    - eq: logarithmic x-axis scale fixed
    - eq: filters are now defined with the `filters` property, leaving the `value` to its default purpose
    - eq: added `rangeX`
    - html: allow `class`, `title` and `style` attributes
    - dropdown: close menu when receiving a value
    - dropdown: removed empty 1st option
    - switch: removed `showValues` (inconsistent with menu/dropdown, feature covered by `values` property)
    - frame: allow loading non local urls

- widget removals
    - `push`, `toggle`: merged into `button`
    - `strip`: features now covered by `panel`
    - `meter`: duplicate of `fader` with `design` to `compact` and `interaction` to `false`
    - `switcher`, `state`, `crossfader`: removed => state management functions added to the `script` widget
    - `keys`: merged with `script`
    - `gyroscope`: not compatible since chrome 74 unless o-s-c goes HTTPS


- remote control
    - removed /TABS
    - added /NOTIFY

- scripting (general)
    - removed MathJS language
    - reuse #{} syntax as as shorthand for JS{{}} (one liner, implicit return)
    - added `locals` variable, a variable store scoped to the widget
    - renamed `global` to `globals`
    - expose environment variables in `globals`: `url`, `env` (query parameters), `platform`, `screen` (width/height)

- script widget
    - always hidden except in project tree
    - `script` property must not be wrapped in a JS{{}} block anymore
    - added `stateGet` and `stateSet` functions
    - added `storage` object, proxy to the document's localStorage object (allows storing data that persist after refresh/close (cleared with the browser's cache)
    - added `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` function proxies with an extra `id` argument (they clear automatically when called multiple times and upon widget removal. `id` is scoped to the widget)


- state
    - quickstate (store/recall from menu) is now stored in the clients cache and persists after refresh/close (cleared with the browser's cache)

- custom module
    - `settings.read(name)`: `name` is now the long name of command-line options (not a camelCased one)
    - `receive()`: optional last argument to pass extra options such as `clientId`
    - client id persist upon page refresh and can be set manually with the client url option `id`


- launcher
    - config save/load
    - allow starting/stopping server without rebooting
    - syntax check on `--midi` option

- server
    - renamed `--url-options` to `--client-options` and make them apply even in remote browsers (can be overridden with url queries)
    - removed `--blank`, `--gui-only`, `--examples`
    - hide `--disable-gpu` (cli-only)
    - added cli-only `--cache-dir` and `--config-file`
    - added `--authentication` option
    - added `--use-ssl` option


- misc
    - canvas: better visibility checks to avoid unnecessary draw calls
    - visualizer: perf improvement (avoid data processing when not visible), all visualizers hook on the same loop to avoid concurrent timeouts
    - button: in 'tap' mode (formerly push with `noRelease`), never send/sync `off` value, automatically reset to `off` when receiving `on`
    - more detached DOM for lighter nested canvas widgets (ie multixy)
    - unified (kind of) dom html structure for widgets, known css tricks will require adjustments.
    - cache and config files are now stored in a folder named `open-stage-control` (located in the system's default location for config file). The `.open-stage-control` is no longer used.
    - added support for icons rotate/flip transform suffixes (example: `^cog.spin`, `^play.rotate-horizontal`)
