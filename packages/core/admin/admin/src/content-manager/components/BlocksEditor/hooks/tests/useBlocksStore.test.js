import * as React from 'react';

import { lightTheme, ThemeProvider } from '@strapi/design-system';
import { render, screen, renderHook } from '@testing-library/react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { useBlocksStore } from '../useBlocksStore';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

const Wrapper = ({ children }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);

  return (
    <ThemeProvider theme={lightTheme}>
      <IntlProvider messages={{}} locale="en">
        <Slate initialValue={initialValue} editor={editor}>
          {children}
        </Slate>
      </IntlProvider>
    </ThemeProvider>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

describe('useBlocksStore', () => {
  it('should return a store of blocks', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    const storeKeys = Object.keys(result.current);
    expect(storeKeys).toContain('paragraph');
    expect(storeKeys).toContain('heading-one');
    expect(storeKeys).toContain('heading-six');
    expect(storeKeys).toContain('heading-three');
    expect(storeKeys).toContain('heading-four');
    expect(storeKeys).toContain('heading-five');
    expect(storeKeys).toContain('heading-six');
    expect(storeKeys).toContain('link');
    expect(storeKeys).toContain('code');
    expect(storeKeys).toContain('quote');
    expect(storeKeys).toContain('list-ordered');
    expect(storeKeys).toContain('list-unordered');
    expect(storeKeys).toContain('list-item');
    expect(storeKeys).toContain('image');

    Object.values(result.current).forEach((block) => {
      expect(block).toHaveProperty('value.type');
      expect(block).toHaveProperty('renderElement');
      expect(block).toHaveProperty('matchNode');
      expect(block).toHaveProperty('isInBlocksSelector');
    });
  });

  it('should match the right node type', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    const paragraphNode = { type: 'paragraph' };
    const headingOneNode = { type: 'heading', level: 1 };
    const headingSixNode = { type: 'heading', level: 6 };
    const linkNode = { type: 'link' };
    const codeNode = { type: 'code' };
    const quoteNode = { type: 'quote' };
    const orderedListNode = { type: 'list', format: 'ordered' };
    const unorderedListNode = { type: 'list', format: 'unordered' };
    const listItemNode = { type: 'list-item' };
    const imageNode = { type: 'image' };

    expect(result.current.paragraph.matchNode(paragraphNode)).toBe(true);
    expect(result.current.paragraph.matchNode(headingOneNode)).toBe(false);
    expect(result.current.paragraph.matchNode(headingSixNode)).toBe(false);
    expect(result.current.paragraph.matchNode(linkNode)).toBe(false);
    expect(result.current.paragraph.matchNode(codeNode)).toBe(false);
    expect(result.current.paragraph.matchNode(quoteNode)).toBe(false);
    expect(result.current.paragraph.matchNode(orderedListNode)).toBe(false);
    expect(result.current.paragraph.matchNode(unorderedListNode)).toBe(false);
    expect(result.current.paragraph.matchNode(listItemNode)).toBe(false);
    expect(result.current.paragraph.matchNode(imageNode)).toBe(false);

    expect(result.current['heading-one'].matchNode(paragraphNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(headingOneNode)).toBe(true);
    expect(result.current['heading-one'].matchNode(headingSixNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(linkNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(codeNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(quoteNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(orderedListNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(unorderedListNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(listItemNode)).toBe(false);
    expect(result.current['heading-one'].matchNode(imageNode)).toBe(false);

    expect(result.current['heading-six'].matchNode(paragraphNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(headingOneNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(headingSixNode)).toBe(true);
    expect(result.current['heading-six'].matchNode(linkNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(codeNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(quoteNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(orderedListNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(unorderedListNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(listItemNode)).toBe(false);
    expect(result.current['heading-six'].matchNode(imageNode)).toBe(false);

    expect(result.current.link.matchNode(paragraphNode)).toBe(false);
    expect(result.current.link.matchNode(headingOneNode)).toBe(false);
    expect(result.current.link.matchNode(headingSixNode)).toBe(false);
    expect(result.current.link.matchNode(linkNode)).toBe(true);
    expect(result.current.link.matchNode(codeNode)).toBe(false);
    expect(result.current.link.matchNode(quoteNode)).toBe(false);
    expect(result.current.link.matchNode(orderedListNode)).toBe(false);
    expect(result.current.link.matchNode(unorderedListNode)).toBe(false);
    expect(result.current.link.matchNode(listItemNode)).toBe(false);
    expect(result.current.link.matchNode(imageNode)).toBe(false);

    expect(result.current.code.matchNode(paragraphNode)).toBe(false);
    expect(result.current.code.matchNode(headingOneNode)).toBe(false);
    expect(result.current.code.matchNode(headingSixNode)).toBe(false);
    expect(result.current.code.matchNode(linkNode)).toBe(false);
    expect(result.current.code.matchNode(codeNode)).toBe(true);
    expect(result.current.code.matchNode(quoteNode)).toBe(false);
    expect(result.current.code.matchNode(orderedListNode)).toBe(false);
    expect(result.current.code.matchNode(unorderedListNode)).toBe(false);
    expect(result.current.code.matchNode(listItemNode)).toBe(false);
    expect(result.current.code.matchNode(imageNode)).toBe(false);

    expect(result.current.quote.matchNode(paragraphNode)).toBe(false);
    expect(result.current.quote.matchNode(headingOneNode)).toBe(false);
    expect(result.current.quote.matchNode(headingSixNode)).toBe(false);
    expect(result.current.quote.matchNode(linkNode)).toBe(false);
    expect(result.current.quote.matchNode(codeNode)).toBe(false);
    expect(result.current.quote.matchNode(quoteNode)).toBe(true);
    expect(result.current.quote.matchNode(orderedListNode)).toBe(false);
    expect(result.current.quote.matchNode(unorderedListNode)).toBe(false);
    expect(result.current.quote.matchNode(listItemNode)).toBe(false);
    expect(result.current.quote.matchNode(imageNode)).toBe(false);

    expect(result.current['list-ordered'].matchNode(paragraphNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(headingOneNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(headingSixNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(linkNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(codeNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(quoteNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(orderedListNode)).toBe(true);
    expect(result.current['list-ordered'].matchNode(unorderedListNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(listItemNode)).toBe(false);
    expect(result.current['list-ordered'].matchNode(imageNode)).toBe(false);

    expect(result.current['list-unordered'].matchNode(paragraphNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(headingOneNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(headingSixNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(linkNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(codeNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(quoteNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(orderedListNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(unorderedListNode)).toBe(true);
    expect(result.current['list-unordered'].matchNode(listItemNode)).toBe(false);
    expect(result.current['list-unordered'].matchNode(imageNode)).toBe(false);

    expect(result.current['list-item'].matchNode(paragraphNode)).toBe(false);
    expect(result.current['list-item'].matchNode(headingOneNode)).toBe(false);
    expect(result.current['list-item'].matchNode(headingSixNode)).toBe(false);
    expect(result.current['list-item'].matchNode(linkNode)).toBe(false);
    expect(result.current['list-item'].matchNode(codeNode)).toBe(false);
    expect(result.current['list-item'].matchNode(quoteNode)).toBe(false);
    expect(result.current['list-item'].matchNode(orderedListNode)).toBe(false);
    expect(result.current['list-item'].matchNode(unorderedListNode)).toBe(false);
    expect(result.current['list-item'].matchNode(listItemNode)).toBe(true);
    expect(result.current['list-item'].matchNode(imageNode)).toBe(false);

    expect(result.current.image.matchNode(paragraphNode)).toBe(false);
    expect(result.current.image.matchNode(headingOneNode)).toBe(false);
    expect(result.current.image.matchNode(headingSixNode)).toBe(false);
    expect(result.current.image.matchNode(linkNode)).toBe(false);
    expect(result.current.image.matchNode(codeNode)).toBe(false);
    expect(result.current.image.matchNode(quoteNode)).toBe(false);
    expect(result.current.image.matchNode(orderedListNode)).toBe(false);
    expect(result.current.image.matchNode(unorderedListNode)).toBe(false);
    expect(result.current.image.matchNode(listItemNode)).toBe(false);
    expect(result.current.image.matchNode(imageNode)).toBe(true);
  });

  it('renders a paragraph block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(result.current.paragraph.renderElement({ children: 'Some text' }), { wrapper: Wrapper });
    const paragraph = screen.getByText('Some text');
    expect(paragraph).toBeInTheDocument();
  });

  it('renders a heading block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current['heading-six'].renderElement({
        children: 'Some heading',
        element: { level: 2 },
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const heading = screen.getByRole('heading', { level: 2, name: 'Some heading' });
    expect(heading).toBeInTheDocument();
  });

  it('renders a link block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current.link.renderElement({
        children: 'Some link',
        element: { url: 'https://example.com' },
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const link = screen.getByRole('link', 'Some link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders a code block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current.code.renderElement({
        children: 'Some code',
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const code = screen.getByRole('code', 'Some code');
    expect(code).toBeInTheDocument();
  });

  it('renders a quote block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current.quote.renderElement({
        children: 'Some quote',
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const quote = screen.getByRole('blockquote', 'Some quote');
    expect(quote).toBeInTheDocument();
  });

  // TODO fix this test
  it.skip('renders a list block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current.list.renderElement({
        children: 'list item',
        element: {
          format: 'unordered',
        },
        attributes: {},
      })
    );

    const list = screen.getByRole('list', 'list item');
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe('ul');
  });

  it('renders a list item block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current['list-item'].renderElement({
        children: 'list item',
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const listItem = screen.getByRole('listitem', 'list item');
    expect(listItem).toBeInTheDocument();
  });

  it('renders an image block properly', () => {
    const { result } = renderHook(useBlocksStore, { wrapper: Wrapper });

    render(
      result.current.image.renderElement({
        children: '',
        element: {
          image: { url: 'https://example.com/image.png', alternativeText: 'Some image' },
        },
        attributes: {},
      }),
      {
        wrapper: Wrapper,
      }
    );
    const image = screen.getByRole('img', { name: 'Some image' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.png');
  });
});
