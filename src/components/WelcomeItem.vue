<template>
  <div class="mt-8 flex relative lg:mt-0 lg:p-[0.4rem_0_1rem_calc(var(--section-gap)/2)]">
    <i
      class="flex items-center justify-center w-8 h-8 text-text lg:absolute lg:top-[calc(50%-25px)] lg:left-[-26px] lg:border lg:border-border lg:bg-background lg:rounded-lg lg:w-[50px] lg:h-[50px]"
    >
      <slot name="icon"></slot>
    </i>
    <div
      class="flex-1 ml-4 lg:ml-0 lg:relative lg:before:content-['_'] lg:before:border-l lg:before:border-border lg:before:absolute lg:before:left-0 lg:before:bottom-[calc(50%+25px)] lg:before:h-[calc(50%-25px)] lg:after:content-['_'] lg:after:border-l lg:after:border-border lg:after:absolute lg:after:left-0 lg:after:top-[calc(50%+25px)] lg:after:h-[calc(50%-25px)] first:before:hidden last:after:hidden"
    >
      <h3 class="text-[1.2rem] font-medium mb-[0.4rem] text-heading">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
