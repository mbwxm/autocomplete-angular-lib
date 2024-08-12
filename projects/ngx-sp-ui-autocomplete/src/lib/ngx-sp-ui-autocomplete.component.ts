import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { AutocompleteItem } from './types';

@Component({
  selector: 'ngx-sp-ui-autocomplete',
  standalone: true,
  imports: [],
  templateUrl: './ngx-sp-ui-autocomplete.component.html',
  styleUrl: './ngx-sp-ui-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements AfterViewInit {

  readonly KEY_PRESS_EVENTS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ENTER: 'Enter',
  } as const;

  @ViewChild('autocompleteinput') public autoCompleteInput: ElementRef;
  /** The search items for the auto complete to search on */
  @Input() public searchItems: AutocompleteItem[];

  /** The name of the item which are being searched */
  @Input() public autoCompleteItemName: string;

  /** The display text in the placeholder of the text input */
  @Input() public autoCompleteItemPlaceholder: string;

  /** Optional function to be called when the User selects an item from the autocomplete, the item
   * value is returned as a string */
  @Output() public autoCompleteSelected = new EventEmitter<string>();

  constructor(public renderer: Renderer2) { }

  public ngAfterViewInit(): void {
    // TODO: Improve UX by handling common key press events when the search items list is open
    this.renderer.listen(this.autoCompleteInput.nativeElement, 'keydown', (keydownEvent: KeyboardEvent) => {
      switch(keydownEvent.key) {
        case this.KEY_PRESS_EVENTS.ARROW_DOWN:
          // TODO: Add logic to iterate down the matching items
          break;
        case this.KEY_PRESS_EVENTS.ARROW_UP:
          // TODO: Add logic to iterate up the matching items
          break;
        case this.KEY_PRESS_EVENTS.ENTER:
          // TODO: Add logic to select the current active matching item
          break;
      }
    });

    // Close the search items list when the User clicks outside of the search items list
    this.renderer.listen(document, 'click', () => {
      this.closeAutocompleteList();
    });
  }

  public filterItems(itemTextInputEvent: InputEvent): void {
    const itemSearchTerm: string = (itemTextInputEvent.target as HTMLInputElement).value;

    // Remove any previous search results
    this.closeAutocompleteList();

    if (itemSearchTerm === '') {
      this.autoCompleteSelected.emit('');
      return;
    }

    // Create a DIV to contain the matching search items
    const autocompleteListDiv = this.renderer.createElement('DIV');
    this.renderer.setAttribute(autocompleteListDiv, 'id', `${this.autoCompleteInput.nativeElement.id}-autocomplete-list`);
    this.renderer.setAttribute(autocompleteListDiv, 'class', 'autocomplete-items');

    // Add the DIV as a child of the autocomplete's input
    this.renderer.appendChild(this.autoCompleteInput.nativeElement, autocompleteListDiv);

    // Find the items that start with the search phrase from those in the list and remove any duplicates
    const matchedItems = this.searchItems.filter((itemName: AutocompleteItem) =>
      itemName.name.toLowerCase().startsWith(itemSearchTerm.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

    // Remove any duplicates
    const distinctMatchedItems = [... new Set(matchedItems.map((item) => item.name))].map((distinctItem: string)=>{
      return { name : distinctItem } as AutocompleteItem;
    });

    // Create a DIV element for each matching item
    distinctMatchedItems.forEach((matchedItem: AutocompleteItem) => {
      // Create a DIV element for each matching item
      const matchedItemElement = this.renderer.createElement('DIV');

      // Highlight matching item with search term
      this.renderer.setProperty(matchedItemElement, 'innerHTML',
        `<strong>${matchedItem.name.substring(0, itemSearchTerm.length)}</strong>${matchedItem.name.substring(itemSearchTerm.length)}` +
        `<input type="hidden" value="${matchedItem}"></input>`);

      // Add the search value to the text input when it is clicked on
      this.renderer.listen(matchedItemElement, 'click', (matchedItemEvent: PointerEvent) => {
        (itemTextInputEvent.target as HTMLInputElement).value = (matchedItemEvent.target as HTMLInputElement).innerText;
        this.autoCompleteSelected.emit((matchedItemEvent.target as HTMLInputElement).innerText);
        this.closeAutocompleteList();
      });
      // Add the matched item to the auto complete list
      this.renderer.appendChild(autocompleteListDiv, matchedItemElement);
    });

    // Add the auto complete list to the containing div of the auto complete input
    this.renderer.appendChild(this.autoCompleteInput.nativeElement.parentNode, autocompleteListDiv);
  }

  private closeAutocompleteList(): void {
    const autoCompleteSearchResultElement = document.getElementById(`${this.autoCompleteInput.nativeElement.id}-autocomplete-list`);
    if (autoCompleteSearchResultElement) {
      this.renderer.removeChild(this.autoCompleteInput.nativeElement.parentNode, autoCompleteSearchResultElement);
    }
  }
}
