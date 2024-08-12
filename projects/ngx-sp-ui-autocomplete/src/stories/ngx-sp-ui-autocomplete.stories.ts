import type { Meta, StoryObj } from '@storybook/angular';
import { AutocompleteComponent } from 'ngx-sp-ui-autocomplete';
import { fn } from '@storybook/test';

const meta: Meta<AutocompleteComponent> = {
  title: 'Example/Autocomplete',
  component: AutocompleteComponent,
  tags: ['autodocs'],
  argTypes: { },
  args: { autoCompleteSelected: fn() }
};

export default meta;
type Story = StoryObj<AutocompleteComponent>;

export const Primary: Story = {
  args: {
    searchItems: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }, { name: 'Grapes' }, { name: 'Pear' },
      { name: 'Plum' }, { name: 'Lime' }, { name: 'Melon' }, { name: 'Peach' }, { name: 'Lemon' }, { name: 'Mango' }],
    autoCompleteItemName: 'fruit',
    autoCompleteItemPlaceholder: 'Fruit'
  },
};
