# frozen_string_literal: true

# 3.times do
#   fullname = Faker::FunnyName.two_word_name.split(' ')
#   user = User.new(userName: Faker::Kpop.iii_groups,
#                   password: '12345',
#                   firstName: fullname[0],
#                   lastName: fullname[1],
#                   profilePicture: Faker::LoremFlickr.image)
#   user.save
# end

limit = 100
URL_BASE = "https://developer.nps.gov/api/v1/parks?fields=images&limit=#{limit}&start="
start = 1
API_KEY = '&api_key=Hbwwee9IX6XMWbZrmgd6XgAoM8WsOzXcGqbR3WoK'

while start < 500
  parks = JSON.parse(open(URL_BASE + start.to_s + API_KEY).read)['data']
  parks.each do |p|
    new_park = {}
    new_park[:latLong] = p['latLong']
    new_park[:name] = p['name']
    new_park[:fullname] = p['fullName']
    new_park[:parkCode] = p['parkCode']
    new_park[:states] = p['states']
    new_park[:designation] = p['designation']
    new_park[:url] = p['url']
    new_park[:description] = p['description']
    new_park[:weatherInfo] = p['weatherInfo']
    park = Park.create(new_park)
    p['images'].each do |i|
      new_image = { park_id: park.id,
                    title: i['title'],
                    altText: i['altText'],
                    url: i['url'],
                    caption: i['caption'],
                    credit: i['credit'] }
      ParkImage.create(new_image)
    end
  end
  start += 100
end

# users = [User.first, User.all[1], User.all[2]]
# parks = [Park.all[80], Park.all[11], Park.all[7], Park.all[90], Park.all[138]]

# i = 0
# while i <= 4
#   PastVisit.create(user: users[0],
#                    park: parks[i],
#                    title: Faker::Lorem.sentence,
#                    description: Faker::Lorem.paragraph_by_chars(256, false),
#                    season: 'Summer',
#                    year: '2018')
#   i += 1
# end

# i = 0
# while i <= 4
#   FutureVisit.create(user: users[1],
#                      park: parks[i],
#                      title: Faker::Lorem.sentence,
#                      description: Faker::Lorem.paragraph_by_chars(256, false),
#                      season: 'Summer',
#                      year: '2020')
#   i += 1
# end

# i = 0
# while i < 3
#   PastVisit.create(user: users[2],
#                    park: parks[i],
#                    title: Faker::Lorem.sentence,
#                    description: Faker::Lorem.paragraph_by_chars(256, false),
#                    season: 'Summer',
#                    year: '2018')
#   i += 1
# end
#
# while i <= 4
#   FutureVisit.create(user: users[2],
#                      park: parks[i],
#                      title: Faker::Lorem.sentence,
#                      description: Faker::Lorem.paragraph_by_chars(256, false),
#                      season: 'Summer',
#                      year: '2018')
#   i += 1
# end
