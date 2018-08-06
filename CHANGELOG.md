# Change log

## 3.0.0

- prop-types is now dependency instead of peer dependency (@markusenglund)
- PropTypes are removed in production to save on size (@markusenglund)
- Now using babel in loose mode & babel-runtime to reduce bundle size further (@markusenglund)
- Made the library available as ES Module in addition to CommonJS (@markusenglund)
- Remove tab-index from overlay (@markusenglund)
- Remove scroll bar when not needed by changing default content overflowY from "scroll" to "auto"
- Added new id props to let users give custom id values to all elements (@rluiten)
- Remove touch functionality in IOS since it doesn't work due to swipe-to-go-back native behaviour.
- Remove box-shadow when the sidebar is not visible, so it's not visible at the edge of the screen.

## 2.3.2

- prop-types is now a peer dependency (@Fallenstedt)

## 2.3.1

- Modify content styles to have momentum scrolling (@Fallenstedt)
- Update examples to eliminate depreciation warnings(@Fallenstedt)
- Update readme's examples(@Fallenstedt)

## 2.3

- Replace findDOMNode by ref callback (@BDav24)
- Allow setting initial sidebar width (@BDav24)

## 2.2

- Move from onTouchTap to onClick for React 15.2 compatibility (@factorize)
- Fix accessibility issues (@cristian-sima)

## 2.1.4

- Update included ES5 build with 2.1.3 changes

## 2.1.3

- Added optional classNames (@sugarshin)

## 2.1.2

- Fix server side rendering (@elliottsj)

## 2.1

- Allow overriding embedded styles (@kulesa)

## 2.0.1

- Allow adding className to sidebar using sidebarClassName prop (@lostdalek)

## 2.0.0

- React 0.14 release
