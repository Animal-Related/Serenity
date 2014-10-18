#!/usr/bin/env ruby

# Run this in a dir with a load of flac files at C notes
# filename pattern: somename-4-00.flac

input_files = Dir.glob('*.flac')

input_files.each do |file|
  match = file.match(/(?<name>.*)\d\d\.flac/)

  12.times do |num|
    system "sox #{file} #{match[:name]}#{num.to_s.rjust(2, '0')}.ogg pitch #{num * 100}"
  end
end
