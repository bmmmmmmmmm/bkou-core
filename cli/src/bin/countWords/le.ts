#!/usr/bin/env node

import { countWords } from "../../pkg/countWords"

countWords(process.argv.slice(2).join(' '))
