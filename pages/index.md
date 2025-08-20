---
layout: page
title: Directory
nav_exclude: true
---

<h1>{{ page.title }}</h1>

{%- assign all = site.pages
  | where_exp: "p", "p.path contains 'pages/'"
  | where_exp: "p", "p.url != page.url"
-%}
{%- assign groups = all | group_by: "dir" | sort: "name" -%}

{%- for g in groups -%}
  {%- comment -%}
    g.name looks like "/pages/", "/pages/guides/", "/pages/guides/pro/"
  {%- endcomment -%}
  {%- assign label = g.name | remove_first: "/pages" | replace_first: "/", "" | replace: "/", " / " | strip -%}

  {%- if label == "" -%}
    <h2>Root</h2>
  {%- else -%}
    <h2>{{ label }}</h2>
  {%- endif -%}

  <ul>
    {%- assign items = g.items | sort: "url" -%}
    {%- for p in items -%}
      {%- unless p.name == "index.md" or p.name == "index.html" -%}
        <li><a href="{{ p.url }}">{{ p.title | default: p.name | split: '.' | first }}</a></li>
      {%- endunless -%}
    {%- endfor -%}
  </ul>
{%- endfor -%}