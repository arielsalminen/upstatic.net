###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#  config.output_style = :compact
#  config.line_comments = false
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
page "/index.html", :layout => :frontpage

#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload, :no_swf => true
# end

# Methods defined in the helpers block are available in templates
helpers do
  def nav_link(link_text, url, options = {})
    options[:class] ||= ""
    options[:class] << " active" if url == current_page.url
    "<li class='" + options[:class] + "'>" + link_to(link_text, url) + "</li>"
  end

  def inline_stylesheet( *sources )
    sources.uniq.map { |source|
      content_tag :style do
        sprockets[ "#{source}.css" ].to_s
      end
    }.join("\n").html_safe
  end

  def inline_script( *sources )
    sources.uniq.map { |source|
      content_tag :script do
        sprockets[ "#{source}.js" ].to_s
      end
    }.join("\n").html_safe
  end
end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :fonts_dir, 'fonts'
set :build_dir, 'docs'

# Pretty urls
activate :directory_indexes

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Minify html
  activate :minify_html

  # Enable cache buster
  activate :asset_hash, ignore: ["img/badge.*", "img/appicon.*", "img/icon-196*"]

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
