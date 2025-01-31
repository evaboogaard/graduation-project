# 11ty Boilerplate

## Index

- [Get started](#get-started)
- [Production build](#production-build)
- [Global Site Information](#global-site-information)
- [CSS and Styling](#css-and-styling)
- [Client-side JavaScript](#client-side-javascript)
- [Global utilites (filters, shortcodes, etc.)](#global-utilites-filters-shortcodes-etc)
- [SVG Icons](#svg-icons)
- [Webfonts](#webfonts)
- [Public folder](#public-folder)
- [11ty Image Transform Plugin](#11ty-image-transform-plugin)
- [DatoCMS Integration](#datocms-utilities)

## Get started

Ensure you have **[Node.js](https://nodejs.org/) version 20 or higher** installed. This is required to properly run the project.

Create an `.env` file in the root of the project and set the `LOCALE` variable, which is necessary for the date filter functionality. For example, you would add `LOCALE=en-US` to your `.env` file.

With your `.env` file configured, proceed with setting up the project:

1. Install dependencies with `npm install`.
2. Start the development server with `npm run start`.

## Production build

For production builds, execute `npm run production`, which includes:

- CSS purge (all CSS is purged and then added inline).

To test the production build locally, run `npm run start-production`. This sets `NODE_ENV=production` and allows you to test CSS purging on your development server.

## Global Site Information

General site settings can be configured in the `site.js` file. This includes defining the site name, general email address, and meta description. It's important to set the `productionUrl` correctly, as it is used to generate absolute URLs, which are essential for things like canonical links.

<hr />

## CSS and Styling

For CSS, we use [PostCSS](https://postcss.org/) with a custom configuration that includes Tailwind CSS and a few other plugins. All CSS files reside in the `src/assets/css` directory. The main CSS file is `global.css`, which orchestrates the inclusion of all our styles.

PostCSS allows us to use modern CSS features like nesting and to write future-proof CSS. It also enables us to use a variety of plugins to optimize our styles. In the end, all CSS is transformed to vanilla CSS that is compatible with the browsers defined in our `browserslist` object in the `package.json` file.

### Architecture

Inside the `blocks`, `layout` and `utilites` folders, you can place your globally available classes.
All those are automatically imported into `global.css` via `@import-glob`, as long they reside there and start with an underscore. The CSS you write is sorted via Cascade Layers. This way, utilities may easily override layout styles, but block/component styles have the last word.

### Utility classes & design tokens

For generating basic utility classes, we utilize [Tailwind](https://tailwindcss.com/) in stripped down way. Basically, every utility is disabled, and we only enable the ones we need. By default, these are text & background colors, font family, font sizes, font weights, line height and stacks.

### Creating new utilities

> **As an example, we will create a new utility class for letter-spacing.**

#### 1. Create a new file in `assets/design-tokens` called `letter-spacing.js`.

#### 2. Add your key-value pairs to the file.

You may also import and use js functions like `interpolate` or `calculateTypeScale` from `utopia-core`

```js
export const letterSpacing = {
  tight: "-0.05em",
  normal: "0",
  wide: "0.05em",
};
```

#### 3. Import your object in `tailwind.config.js` and apply it to the `letterSpacing` key in the `theme` object.:

New design tokens need to be applied to Tailwind's reserved keys, you can look up the key in the [Tailwind CSS documentation](https://tailwindcss.com/docs/theme).

```js
import { letterSpacing } from "./src/design-tokens/letter-spacing.js";

export default {
  ...
  theme: {
    ...
    letterSpacing: letterSpacing
  }
}
```

#### 4. Enable the utility in `tailwind.config.js` by adding it to the `corePlugins` array:

```js
export default {
  ...
  corePlugins: [
    ...
    "letterSpacing"
  ]
}
```

#### 5. Generate CSS Custom Properties from your design tokens. (Optional, but recommended)

This way, you can also use your design tokens without using utility classes.

In the plugins array of `tailwind.config.js`, add the following to `groups` array the first `plugin` function:

```js
const groups = [
  ...,
  { key: "letterSpacing", prefix: "tracking" }
];
```

The `key` property is the key of the Tailwind theme object, and the `prefix` property is any string you want to prefix your Custom Properties with:

```css
/* Output */
:root {
  --tracking-tight: -0.05em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
}
```

### Using media queries

For media queries, we use [custom media queries](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) that are defined in `src/assets/css/_media.css`.

```css
/* src/assets/css/_media.css */
@custom-media --s (width >= 25em);
@custom-media --m (width >= 40em);
```

You can use these media queries in your CSS like this:

```css
.my-class {
  color: red;

  @media (--s) {
    color: blue;
  }
}
```

### CSS Purge Safelist

In production mode, all CSS is purged to remove any unused classes. If however, there are specific classes that should not be purged during the production build process, like dynamically added classes, they can be added to a safelist. To manage this safelist, edit the file `utils/transforms/css-purge-inline.js`.

<hr />

## Client-side JavaScript

All JavaScript files reside in the `src/assets/scripts` directory.
For Client-side Javascript bundling, we use [esbuild](https://esbuild.github.io/). This allows us to install and use npm packages in our client-side JavaScript files:

```js
// Import functions from npm packages
import { myFunction } from "my-npm-package";

// Import functions from other files
import { myOtherFunction } from "./my-other-file.js";

// Import other files as whole
import "other-directory/my-other-file.js";
```

For embedding JavaScript from the directory in your Nunjucks templates, use the following shortcode:

```twig
{% script src="my-file.js" %}
{% script src="other-directory/my-file.js" %}
```

## Global utilites (filters, shortcodes, etc.)

We have a few global utilities like nunjucks filters, or global filters or shortcodes. They are all located in the `src/utils` directory.

For example, to use the `readableDate` filter in your Nunjucks templates:

```twig
{{ sampleDate | readableDate({ month: "short", day: "numeric" }) }}
```

Ensure that `LOCALE` is defined in your `.env` file to display dates in the correct language.

<hr />

## SVG Icons

SVG icons should be placed in the `src/icons` directory. A single combined icon file will be generated from these icons, allowing you to reference them easily throughout your project. We have implemented a shortcode for embedding these SVG icons that requires the `icon` property. The `alt` text and `width` attributes are optional but recommended for accessibility and layout purposes.

Additionally, any instance of black used for fill or border colors within the icons, whether specified as `black`, `#000`, or `#000000`, will automatically be replaced with `currentColor`. This ensures the icons inherit the text color from their surrounding context, improving flexibility and theme compatibility.

Here's how to use the shortcode to insert an SVG icon:

```twig
{% icon icon="github", alt="Github", width="2rem" %}
```

This shortcode will insert the GitHub icon with an alternative text "Github" and a width of 2 rem.

<hr />

## Webfonts

- Place your font files, preferably WOFF2-files in the `src/assets/fonts` folder.
- Include font-face declarations and preloading instructions in the `src/assets/css/_fonts.css` file.

> We import the `_fonts.css` file first in the `global.css` file to ensure that the fonts are loaded before any other styles.

<hr />

## Public folder

You can place any static files in the `public` directory. These files will be copied over to the output directory (`/dist`) during the build process and will not be transformed.

E.g., you can place a `robots.txt` file in the `public` directory, and it will be copied to the root of the output directory.

<hr />

## 11ty Image Transform Plugin

Our project utilizes the 11ty Image Transform Plugin to automatically optimize and generate responsive images. This powerful tool enhances our site's performance and user experience across various devices and network conditions.

Key features include:

- Automatic conversion of `<img>` tags to responsive `<picture>` elements
- Generation of multiple image formats (e.g., WebP, JPEG) for broad compatibility
- Creation of various image sizes for different viewport widths
- Addition of lazy loading attributes for improved page load times

The plugin is configured in our `.eleventy.js` file, allowing for customization of output formats, widths, and other parameters to suit our project's specific needs.

For detailed information about the plugin's capabilities and configuration options, refer to the [official 11ty Image Transform Plugin documentation](https://www.11ty.dev/docs/plugins/image/#eleventy-transform).

<hr />

## DatoCMS Utilities

This project includes special utilities designed to work seamlessly with DatoCMS, enhancing the way we handle images and meta tags.

### DatoPicture Shortcode

We have implemented a custom shortcode called `datoPicture` that processes image data provided by DatoCMS. This shortcode generates image tags that can be further processed by the 11ty Image plugin. To use this shortcode in your Nunjucks templates:

```twig
{% datoPicture imgObj=myDatoCMSImage, widths=[400, 800], sizes="(min-width: 22em) 30vw, 100vw" %}
```

This shortcode allows for flexible image handling, supporting various parameters such as custom widths, sizes, formats, and more. It's particularly useful for optimizing images and implementing responsive image solutions.

### Fetch Meta Images Transform

The `fetch-meta-images` transform is a powerful utility that works in conjunction with DatoCMS and the SEO meta tags it generates. This transform performs several important tasks:

1. It scans HTML files for Open Graph and Twitter card image meta tags.
2. Downloads the specified images from DatoCMS.
3. Saves these images locally in the `dist/assets/images/social-share` directory.
4. Updates the meta tags to point to the local copies of the images.
5. Converts SVG images to PNG format when necessary.

This process ensures that social media share images are available locally, potentially improving page load times and reducing dependency on external services. The transform is automatically applied to all HTML files during the build process.

These DatoCMS utilities streamline the process of working with external content and assets, ensuring optimal performance and flexibility in your 11ty project.

<hr />
