import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AutocompleteComponent } from './ngx-sp-ui-autocomplete.component';
import { ChangeDetectionStrategy, Renderer2, Type } from '@angular/core';
import { AutocompleteItem } from './types';

describe('AutocompleteComponent', () => {

  const mockName = 'status';
  const mockPlaceholder = 'Status';
  const mockItems: AutocompleteItem[] = [
    { name: 'Pending' },
    { name: 'Active' },
    { name: 'On Hold' },
    { name: 'Complete' },
    { name: 'Expired' },
    { name: 'Cancelled' }];
  const mockSelectedAutocompleteItem = mockItems[1];

  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
      providers: [Renderer2]
    }).overrideComponent(AutocompleteComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Autocomplete name and placeholder', () => {
    it('should set the name from the name provided', () => {
      // ARRANGE
      component.autoCompleteItemName = mockName;

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector(`input[name='${mockName}']`);

      // ASSERT
      expect(autoCompleteInput).toBeTruthy();
      expect(autoCompleteInput.name).toEqual(mockName);
    });

    it('should set the placeholder from the placeholder provided', () => {
      // ARRANGE
      component.autoCompleteItemPlaceholder = mockPlaceholder;

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector(`input[placeholder='${mockPlaceholder}']`);

      // ASSERT
      expect(autoCompleteInput).toBeTruthy();
      expect(autoCompleteInput.placeholder).toEqual(mockPlaceholder);
    });
  });

  describe('Autocomplete events and logic', () => {
    it('should render an autocomplete item element based on the auto complete input provided', fakeAsync(() => {
      // ARRANGE
      component.searchItems = mockItems;
      const renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
      spyOn(renderer, 'appendChild').and.callThrough();

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector('input[type=\'text\']') as HTMLInputElement;
      // Find the 'Active' mock item from the list
      autoCompleteInput.value = 'ac'
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();

      const autoCompleteList = fixture.debugElement.nativeElement.querySelector('.autocomplete-items');
      const autoCompleteListItems = fixture.debugElement.nativeElement.querySelectorAll('.autocomplete-items div');

      // ASSERT
      expect(autoCompleteListItems).toBeTruthy();
      expect(autoCompleteListItems.length).toEqual(1); // The 'Active' item
      expect(autoCompleteListItems[0].innerText).toEqual(mockSelectedAutocompleteItem.name); // The 'Active' item
      // Check the final appendChild has been called which adds the autocomplete items list to the root autocomplete div.
      expect(autoCompleteList).toBeTruthy();
      expect(renderer.appendChild).toHaveBeenCalledWith(autoCompleteInput.parentNode, autoCompleteList);
    }));

    it('should not render an autocomplete item element based on the auto complete input provided', fakeAsync(() => {
      // ARRANGE
      component.searchItems = mockItems;

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector('input[type=\'text\']') as HTMLInputElement;
      // No matching items match this search phrase
      autoCompleteInput.value = 'activated'
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();

      const autoCompleteListItems = fixture.debugElement.nativeElement.querySelectorAll('.autocomplete-items div');

      // ASSERT
      expect(autoCompleteListItems.length).toBe(0);
    }));

    it('should close the auto complete items list, emit the value and set the value into the auto complete input when an autocomplete item has been selected', fakeAsync(() => {
      // ARRANGE
      component.searchItems = mockItems;
      spyOn(component.autoCompleteSelected, 'emit')

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector('input[type=\'text\']') as HTMLInputElement;
      // Find the 'Active' mock item from the list
      autoCompleteInput.value = 'ac'
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();

      const autoCompleteListItems = fixture.debugElement.nativeElement.querySelectorAll('.autocomplete-items div');
      autoCompleteListItems[0].dispatchEvent(new Event('click'));
      tick();
      fixture.detectChanges();
      const autoCompleteList = fixture.debugElement.nativeElement.querySelector('.autocomplete-items');

      // ASSERT
      expect(autoCompleteList).toBeFalsy();
      expect(autoCompleteInput.value).toEqual(mockSelectedAutocompleteItem.name);
      expect(component.autoCompleteSelected.emit).toHaveBeenCalledWith(mockSelectedAutocompleteItem.name);
    }));

    it('should emit an empty value when a value has been removed from the auto complete input', fakeAsync(() => {
      // ARRANGE
      component.searchItems = mockItems;
      spyOn(component.autoCompleteSelected, 'emit')

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector('input[type=\'text\']') as HTMLInputElement;
      // Find the 'Active' mock item from the list
      autoCompleteInput.value = 'ac'
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();

      // Enter the blank value
      autoCompleteInput.value = ''
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();

      // ASSERT
      expect(component.autoCompleteSelected.emit).toHaveBeenCalledWith('');
      expect(autoCompleteInput.value).toEqual('');
    }));

    it('should render one autocomplete item element when there are duplicate items in the search items data', fakeAsync(() => {
      // ARRANGE
      const mockDuplicateItems: AutocompleteItem[] = [
        { name: 'Active' },
        { name: 'Complete' },
        { name: 'Complete' },
        { name: 'Complete' },
        { name: 'Complete' }];
      component.searchItems = mockDuplicateItems;

      // ACTION
      fixture.detectChanges();
      const autoCompleteInput = fixture.debugElement.nativeElement.querySelector('input[type=\'text\']') as HTMLInputElement;
      // Find the 'Active' mock item from the list
      autoCompleteInput.value = 'Complete'
      autoCompleteInput.dispatchEvent(new InputEvent('input'));
      tick();
      fixture.detectChanges();
      const autoCompleteListItems = fixture.debugElement.nativeElement.querySelectorAll('.autocomplete-items div');

      // ASSERT
      expect(autoCompleteListItems).toBeTruthy();
      expect(autoCompleteListItems.length).toEqual(1); // The 'Active' item
    }));
  });

});
