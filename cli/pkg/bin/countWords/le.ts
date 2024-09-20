#!/usr/bin/env node

import { countWords } from "../../src/countWords"

countWords(process.argv.slice(2).join(' '))
