# _plugins/round_or_dash.rb

module Jekyll
  module TextFormatting
    # Usage:
    #   {{ value | format_measure }}                      # 3 decimals, imperial
    #   {{ value | format_measure: 2, "imperial" }}       # "X.XX in"
    #   {{ value | format_measure: 1, "metric" }}         # "X.X cm"
    #
    # Behavior:
    # - nil/blank/non-numeric -> "- in" / "- cm"
    # - "n/a" / "N/A" / "na" / "NA" -> "N/A" (no unit)
    # - numeric -> rounded number + unit
    def ping(value = "pong")
      "PING:" + value.to_s
    end

    def format_mass(input, decimals = 3, unit = "imperial")
      # Choose suffix up front
      unit_str = unit.to_s.downcase
      suffix = (unit_str == "metric") ? " g" : " oz"

      # Normalize token for quick checks
      token = input.to_s.strip.downcase

      # Explicit N/A markers (unitless)
      return "N/A" if token == "n/a" || token == "na"

      # Nil/blank -> dash with unit
      return "-" + suffix if input.nil? || token.empty?

      # Try to parse a number (also handles "5 in", "5cm" by grabbing first number)
      num = begin
        if input.is_a?(String)
          m = input.match(/-?\d+(?:\.\d+)?/)
          Float(m[0]) if m
        else
          Float(input)
        end
      rescue ArgumentError, TypeError
        nil
      end

      # Non-numeric -> dash with unit
      return "-" + suffix if num.nil?

      # Normalize decimals
      decimals = decimals.to_i
      decimals = 0 if decimals < 0

      sprintf("%.#{decimals}f", num) + suffix
    end

    def format_measure(input, decimals = 3, unit = "imperial")
      # Choose suffix up front
      unit_str = unit.to_s.downcase
      suffix = (unit_str == "metric") ? " cm" : " in"

      # Normalize token for quick checks
      token = input.to_s.strip.downcase

      # Explicit N/A markers (unitless)
      return "N/A" if token == "n/a" || token == "na"

      # Nil/blank -> dash with unit
      return "-" + suffix if input.nil? || token.empty?

      # Try to parse a number (also handles "5 in", "5cm" by grabbing first number)
      num = begin
        if input.is_a?(String)
          m = input.match(/-?\d+(?:\.\d+)?/)
          Float(m[0]) if m
        else
          Float(input)
        end
      rescue ArgumentError, TypeError
        nil
      end

      # Non-numeric -> dash with unit
      return "-" + suffix if num.nil?

      # Normalize decimals
      decimals = decimals.to_i
      decimals = 0 if decimals < 0

      sprintf("%.#{decimals}f", num) + suffix
    end
  end
end

Liquid::Template.register_filter(Jekyll::TextFormatting)
