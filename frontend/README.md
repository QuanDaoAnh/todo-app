## Node v20.15.1
```docker build -f Dockerfile.dev -t todo-frontend-dev .```

```docker run -p 3000:3000 -v $(pwd):/app todo-frontend-dev```