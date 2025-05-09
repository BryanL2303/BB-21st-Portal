# frozen_string_literal: true

SecureHeaders::Configuration.default do |config|
  config.csp = {
    default_src: ["'self'"],
    script_src: ["'self'", "'unsafe-inline'", 'https://site-assets.fontawesome.com'],
    object_src: ["'none'"],
    style_src: ["'self'", 'https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css'],
    font_src: ["'self'", 'https://site-assets.fontawesome.com'],
    img_src: ["'self'", 'data:'],
    connect_src: ["'self'"],
    media_src: ["'self'"],
    frame_src: ["'none'"],
    form_action: ["'self'"]
  }
end
