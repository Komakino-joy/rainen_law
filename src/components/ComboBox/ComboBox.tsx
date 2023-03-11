import React from 'react'

const ComboBox = () => {
  return (
    <div>ComboBox</div>
  )
}

export default ComboBox

// import React from 'react'
// import classNames from 'classnames'
// import { useCombobox } from "downshift"

// import './ComboBox.scss'

// interface ComboBoxProps {
//   onChange: any;
//   labelText?: string;
//   value:string;
//   setValue: any;
// }

// const ComboBoxExample:React.FC<ComboBoxProps> = ({
//   onChange,
//   labelText,
//   value,
//   setValue,
//   ...props
// }) => {
//   const books = [
//     {author: 'Harper Lee'},
//     {author: 'Lev Tolstoy'},
//     {author: 'Fyodor Dostoyevsy'},
//     {author: 'Oscar Wilde'},
//     {author: 'George Orwell'},
//     {author: 'Jane Austen'},
//     {author: 'Marcus Aurelius'},
//     {author: 'Fyodor Dostoevsky'},
//     {author: 'Lev Tolstoy'},
//     {author: 'Fyodor Dostoevsky'},
//   ]


  
//   function getBooksFilter(inputValue: any) {
//     const lowerCasedInputValue = inputValue.toLowerCase()

//     return function booksFilter(book: any) {
//       return (
//         !inputValue ||
//         book.author.toLowerCase().includes(lowerCasedInputValue)
//       )
//     }
//   }

//   function ComboBox() {
//     const [items, setItems] = React.useState(books)

//     const stateReducer = React.useCallback((state, actionAndChanges) => {
//       const {type, changes} = actionAndChanges
//       // returning an uppercased version of the item string.
//       switch (type) {
//         case useCombobox.stateChangeTypes.InputChange:
//           // onChange(changes.inputValue.toUpperCase())
//           setValue(changes.inputValue.toUpperCase())
//           return {
//             // return normal changes.
//             ...changes,
//             // but taking the change from default reducer and uppercasing it.
//             inputValue: changes.inputValue.toUpperCase(),
//           }
//         // also on selection.
//         case useCombobox.stateChangeTypes.ItemClick:
//         case useCombobox.stateChangeTypes.InputKeyDownEnter:
//         case useCombobox.stateChangeTypes.InputBlur:
//           // onChange(changes.inputValue.toUpperCase())
//           setValue(changes.inputValue.toUpperCase())
//           return {
//             ...changes,
//             // if we had an item selected.
//             ...(changes.selectedItem && {
//               // we will show it uppercased.
//               inputValue: changes.inputValue.toUpperCase(),
//             }),
//           }
//         default:
//           return changes // otherwise business as usual.
//       }
//     }, [])

//     const {
//       isOpen,
//       getToggleButtonProps,
//       getLabelProps,
//       getMenuProps,
//       getInputProps,
//       highlightedIndex,
//       getItemProps,
//       selectedItem,
//     } = useCombobox({
//       items,
//       // onSelectedItemChange: ({ inputValue }) => onChange(inputValue),
//       // onInputValueChange({inputValue}) {
//       //   setItems(books.filter(getBooksFilter(inputValue)))
//       // },
//       itemToString(item) {
//         return item ? item.author: ''
//       },
//       stateReducer
//     })

//     return (
//       <div className='combo-box-wrapper'>
//         <div className="combo-box-container">
//           <label className="combo-box-label" {...getLabelProps()}>
//             {labelText}
//           </label>
//           <div className="input-button-container">
//             <input
//               {...getInputProps()}
//             />
//             <button
//               aria-label="toggle menu"
//               type="button"
//               {...getToggleButtonProps()}
//             >
//               {isOpen ? <>&#8593;</> : <>&#8595;</>}
//             </button>
//           </div>
//         </div>
//         <ul
//           className={`combo-box-dropdown-container ${
//             !(isOpen && items.length) && 'hidden'
//           }`}
//           {...getMenuProps()}
//         >
//           {isOpen &&
//             items.map((item: any, index) => (
//               <li
//                 className={classNames(
//                   highlightedIndex === index && 'highlighted-index',
//                   selectedItem === item && 'selected-item',
//                   'combo-box-item',
//                 )}
//                 key={`${item.value}${index}`}
//                 {...getItemProps({item, index})}
//               >
//                 <span>{item.author}</span>
//               </li>
//             ))}
//         </ul>
//       </div>
//     )
//   }

//   return <ComboBox />
// }

// export default ComboBoxExample