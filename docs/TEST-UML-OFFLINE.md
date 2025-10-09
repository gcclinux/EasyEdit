# Test UML Offline

This file tests that UML diagrams work **without internet connection**.

## Test 1: Simple Class

```plantuml
#title: Simple Class
[User|username: string|login()]
```

## Test 2: Inheritance

```plantuml
#title: Inheritance
[Animal]
[Dog]
[Cat]
[Animal] <:- [Dog]
[Animal] <:- [Cat]
```

## Test 3: Flow

```plantuml
#title: Simple Flow
#direction: right
[<start> Start] -> [Process] -> [<end> End]
```

## Test 4: Actor

```plantuml
#title: Actor Example
[<actor> User] -> [System]
```

## Test 5: Package

```plantuml
#title: Package
[<package> MyApp|
  [Component A]
  [Component B]
]
```

---

**Instructions:**
1. Disconnect from internet
2. Open this file in EasyEdit
3. All diagrams above should render perfectly
4. If they render, UML is working offline! ✅
