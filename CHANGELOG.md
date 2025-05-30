# Changelog

## [0.0.11](https://github.com/stenin-nikita/route-peek/compare/v0.0.10...v0.0.11) (2025-05-30)


### Features

* add id property to route record and matched route ([de7d14f](https://github.com/stenin-nikita/route-peek/commit/de7d14fa909fe80f076028a37e08b5b212ae5032))
* support matching with trailing slash ([a2539bf](https://github.com/stenin-nikita/route-peek/commit/a2539bf2bc12e0aea30718142a2e4dc71f58be3b))
* support trailing slash to parser ([471ba23](https://github.com/stenin-nikita/route-peek/commit/471ba23469e1594d412197692d4234863d86a31b))


### Bug Fixes

* fix some corner cases ([1ce113b](https://github.com/stenin-nikita/route-peek/commit/1ce113b2629d23c05bdb470d2b101d3e5a960753))

## [0.0.10](https://github.com/stenin-nikita/route-peek/compare/v0.0.9...v0.0.10) (2025-03-17)


### Features

* improve match params ([f4eeb4d](https://github.com/stenin-nikita/route-peek/commit/f4eeb4d9a5db8b3d51630605e7057b4db80bd8a8))

## [0.0.9](https://github.com/stenin-nikita/route-peek/compare/v0.0.8...v0.0.9) (2025-03-15)


### Features

* create new implementation based on fsm ([1548ddb](https://github.com/stenin-nikita/route-peek/commit/1548ddb329929a34b89160f753d9aa0a2e75c767))
* move calculate score to parser ([5421581](https://github.com/stenin-nikita/route-peek/commit/54215813672e63162a6d65aef638980db2ea4135))
* remove old implementation ([c2c3d60](https://github.com/stenin-nikita/route-peek/commit/c2c3d604603503c87e84f9ac4305f8cad1c5b898))

## [0.0.8](https://github.com/stenin-nikita/route-peek/compare/v0.0.7...v0.0.8) (2024-11-06)


### Features

* move capturing groups to parser ([2ad44fb](https://github.com/stenin-nikita/route-peek/commit/2ad44fbbb2ae7d968abbe9e665f4bf644ef97023))

## [0.0.7](https://github.com/stenin-nikita/route-peek/compare/3e462836...v0.0.7) (2024-10-30)


### Features

* add support ignore case option ([bb99d9f](https://github.com/stenin-nikita/route-peek/commit/bb99d9fb3927a2ca0b57d97957ebcb1f38a2a343))
* implement test method for PathPattern ([1efc5c2](https://github.com/stenin-nikita/route-peek/commit/1efc5c2d5c54280bcafcc366254b8af4d0e1b1f3))
* init repository ([3e46283](https://github.com/stenin-nikita/route-peek/commit/3e462836aa3d2551bd7fa0b4e0c9ee6fcb4ed22e))
* rename method from match to exec ([094f13e](https://github.com/stenin-nikita/route-peek/commit/094f13ef6acd56c89f8e06df70e01e0c422e03b6))
* support multiple param with same name ([acdcb14](https://github.com/stenin-nikita/route-peek/commit/acdcb1451eb2a73df24b23b8355348a80755bb6c))


### Bug Fixes

* add backtrack protection ([efb78fc](https://github.com/stenin-nikita/route-peek/commit/efb78fce6e980b1c29173f092966502e78c435bb))
* escape slash in default pattern ([7381384](https://github.com/stenin-nikita/route-peek/commit/7381384171b21d579ca4e0cc7497e11f1ab41139))
* export PathPatternOptions ([cb68bf8](https://github.com/stenin-nikita/route-peek/commit/cb68bf83aa70adf07fec35f1b7521d02c0f15051))
* improve match for corner cases ([2d79795](https://github.com/stenin-nikita/route-peek/commit/2d797954f0b8a1ce337761c67dc754835a39398f))
* set correct value for empty repeatable param ([79550b5](https://github.com/stenin-nikita/route-peek/commit/79550b5b0e56d39cc460a5cd5d7497a146512dd3))
* use constant in path pattern ([559dc07](https://github.com/stenin-nikita/route-peek/commit/559dc07ac39148883f6ffd2dabd2019fa3f227b1))
* use non-greedy quantifier for repeatable segments ([34e51ef](https://github.com/stenin-nikita/route-peek/commit/34e51efd5642a928b1422917927f3976c197b52a))
